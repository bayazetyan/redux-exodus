import { Dispatch } from 'redux';
import { getReducer } from './reducers/getReducer';
import EventEmitter from '../helpers/eventEmitter'

import {
  dispatchAction,
  generateActionName,
  dispatchErrorAction,
  dispatchPendingAction,
  dispatchRestoreAction,
  dispatchSuccessAction,
} from '../utils/action-utils';

import { isFunction } from '../utils/misc';

import Exodus from './index'

type EventArguments = {
  result: any,
  dispatch: Dispatch
}

export type ActionState<T = any> = {
  payload?: T
  status: number
  error?: string | string[]
}

export interface Action<T = any> {
  type: string
  apiCallArguments: any[]
  data: ActionState<T>
}

export interface CreateActionWrapper {
  reducerHandler: {
    [key: string]: (state: Object, action: Action) => Object
  },
  saveDefaultData: (defaultState: Record<string, any>) => void,
  storeKey: {
    [key: string]: string
  },
  (dispatch: Dispatch): Function
}

export interface CreateAction {
  delay: (delay: number, ...args: any[]) => void,
  restore: (restorePayload: boolean) => void,
  settings: (settings: ActionSettings) => void,
  (...args: any[]): void
}

export interface ActionSettings {
  name: string
  key?: string
  keys?: string[]
  persists?: boolean
  forceUpdate?: boolean
  merge?: (...args: any[]) => boolean
  apiCall?: (...args: any[]) => Promise<any>

  // methods
  onSuccess?: (data: EventArguments) => void
  onError?: (data: EventArguments) => void
  reducer?: (state: Object, action: Action) => Object
  handleResponse?: (data: any) => any
}

const DEFAULT_SETTINGS = {
  name: 'ACTION',
  forceUpdate: true,
  merge: () => false,
}

function createAction(settings: ActionSettings): CreateActionWrapper {
  const actionName = generateActionName(settings.name)
  let defaultState: any;

  function wrapper(dispatch: Dispatch): CreateAction {
    let dynamicSettings = {}

    async function action(...args: any[]) {
      if (settings.apiCall) {
        dispatchPendingAction({dispatch, name: settings.name, args})
        try {
          const response = await settings.apiCall.apply(null, args)
          const handleResponse = settings.handleResponse || Exodus.defaultSettings.handleResponse;

          if (response instanceof Response && response.ok) {
            const result = await response?.json() || await response?.text()
            const _result = handleResponse ? await handleResponse(result) : result

            dispatchSuccessAction({
              args,
              dispatch,
              dynamicSettings,
              payload: _result,
              name: settings.name,
            }, settings.persists)

            if (settings.onSuccess) {
              settings.onSuccess({
                result: _result,
                dispatch,
              })
            }
            // clear dynamic settings
            setSettings(null)

            return _result
          } else if (!(response instanceof Response) && response && !response.error && !response.errors) {
            const _response = handleResponse ? await handleResponse(response) : response

            dispatchSuccessAction({
              args,
              dispatch,
              dynamicSettings,
              name: settings.name,
              payload: _response,
            }, settings.persists)
            if (settings.onSuccess) {
              settings.onSuccess({
                dispatch,
                result: _response,
              })
            }
            // clear dynamic settings
            setSettings(null)

            return _response
          } else {
            dispatchErrorAction({
              dispatch,
              name: settings.name,
              error: response?.error || response?.errors
            })
            if (settings.onError) {
              settings.onError({
                dispatch,
                result: response?.error || response?.errors,
              })
            }

            EventEmitter.emit('onError', {
              name: settings.name,
              action: (...newArgs: any[]) => createAction(settings)(dispatch).apply(newArgs.length > 0 ? newArgs : args),
              result: response?.error || response?.errors,
            })
            // clear dynamic settings
            setSettings(null)

            return response
          }
        } catch (err) {
          dispatchErrorAction({dispatch, name: settings.name, error: err})
          if (settings.onError) {
            settings.onError({
              dispatch,
              result: err,
            })
          }

          EventEmitter.emit('onError', {
            result: err,
            name: settings.name,
            action: (...newArgs: any[]) => createAction(settings)(dispatch).apply(newArgs.length > 0 ? newArgs : args),
          })
          // clear dynamic settings
          setSettings(null)

          return err
        }
      } else {
        const result = settings.handleResponse
          ? await settings.handleResponse(args[0])
          : args[0]

        dispatchAction({dispatch, name: settings.name, payload: result})
        if (settings.onSuccess) {
          settings.onSuccess({
            result: args[0],
            dispatch,
          })
        }
      }
    }

    function setSettings(_settings: ActionSettings | null) {
      if (_settings) {
        dynamicSettings = _settings
      } else {
        dynamicSettings = {}
      }
    }

    // Methods
    action.restore = (restorePayload: boolean = true) => {
      if (settings.key) {
        dispatchRestoreAction({
          dispatch,
          restorePayload,
          name: settings.name,
          payload: defaultState[settings.key],
          hasApiCall: Boolean(settings.apiCall),
        })
      }
    }

    action.delay = (delay: number, ...args: any[]) => {
      setTimeout(() => {
        action(...args)
      }, delay);
    }

    action.settings = (settings: ActionSettings): CreateAction => {
      setSettings(settings)
      return action
    }

    return action
  }

  // reducers
  wrapper.reducerHandler = {
    [actionName]: settings?.reducer || getReducer({...DEFAULT_SETTINGS, ...settings})
  }

  // methods
  wrapper.saveDefaultData = (value: Record<string, any>) => {
    if (!defaultState) {
      defaultState = { ...value }
    }
  }

  const keyValue = settings?.key || settings.keys && settings.keys[0] || settings.name
  // settings
  wrapper.storeKey = {
    [keyValue]: settings.name
  }

  return wrapper
}

export default Object.freeze(createAction)
