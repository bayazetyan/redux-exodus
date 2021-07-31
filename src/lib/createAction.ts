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

import Exodus from './index'
import { getResponse } from '../helpers/handleResponse';

type EventArguments = {
  result: any,
  dispatch: Dispatch
}

type PENDING = 1
type ERROR = 0
type SUCCESS = 2

export type ActionState<T = any> = {
  payload: T
  status?: ERROR | PENDING | SUCCESS
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
  (dispatch: Dispatch): CreateAction
}

export interface CreateAction<T = any> {
  delay: (delay: number, ...args: any[]) => Promise<T> | void,
  restore: (restorePayload?: boolean) => void,
  settings: (settings: ActionSettings) => CreateAction,
  (...args: any[]): Promise<T> | void
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

          const { isSuccess, data } = await getResponse(response)
          const _response = handleResponse ? await handleResponse(data) : data

          if (isSuccess) {
            dispatchSuccessAction({
              args,
              dispatch,
              dynamicSettings,
              payload: _response,
              name: settings.name,
            }, settings.persists)

            if (settings.onSuccess) {
              settings.onSuccess({
                result: _response,
                dispatch,
              })
            }
            // clear dynamic settings
            setSettings(null)

            return _response
          } else {
            dispatchErrorAction({
              dispatch,
              name: settings.name,
              error: _response?.error || _response?.errors || _response
            })
            if (settings.onError) {
              settings.onError({
                dispatch,
                result: _response?.error || _response?.errors || _response,
              })
            }

            EventEmitter.emit('onError', {
              name: settings.name,
              action: (...newArgs: any[]) => createAction(settings)(dispatch).apply(newArgs.length > 0 ? newArgs : args),
              result: _response?.error || _response?.errors || _response,
            })
            // clear dynamic settings
            setSettings(null)

            return _response
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
      return new Promise((r) => {
        setTimeout(() => {
          r(action(...args))
        }, delay);
      })
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
