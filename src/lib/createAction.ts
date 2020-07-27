import { Dispatch } from 'redux';
import { getReducer } from './getReducer';
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

export interface Action {
  type: string
  apiCallArguments: any[]
  data: {
    payload?: any
    status: number
    error?: string | string[]
  }
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
  (): void
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

export default function createAction(settings: ActionSettings): CreateActionWrapper {
  const actionName = generateActionName(settings.name)
  let defaultState: any;

  function wrapper(dispatch: Dispatch): CreateAction {
    async function action(...args: any[]) {
      if (settings.apiCall) {
        dispatchPendingAction(dispatch, settings.name, args)
        try {
          const response = await settings.apiCall.apply(null, args)
          const handleResponse = settings.handleResponse || Exodus.defaultSettings.handleResponse;

          if (response instanceof Response && response.ok) {
            const result = response?.json() || response?.text()
            const _result = handleResponse ? handleResponse(result) : result

            dispatchSuccessAction(dispatch, settings.name, _result, args)
            if (settings.onSuccess) {
              settings.onSuccess({
                result: _result,
                dispatch,
              })
            }

            return _result
          } else if (response) {
            const _response = handleResponse ? handleResponse(response) : response

            dispatchSuccessAction(dispatch, settings.name, _response, args)
            if (settings.onSuccess) {
              settings.onSuccess({
                dispatch,
                result: _response,
              })
            }

            return _response
          } else {
            dispatchErrorAction(dispatch, settings.name, response.error)
            if (settings.onError) {
              settings.onError({
                dispatch,
                result: response.error,
              })
            }

            EventEmitter.emit('onError', { name: settings.name, result: response.error })
          }
        } catch (err) {
          dispatchErrorAction(dispatch, settings.name, err)
          if (settings.onError) {
            settings.onError({
              dispatch,
              result: err,
            })
          }

          EventEmitter.emit('onError', { name: settings.name, result: err })
        }
      } else {
        dispatchAction(dispatch, settings.name, args[0])
        if (settings.onSuccess) {
          settings.onSuccess({
            dispatch,
            result: args[0],
          })
        }
      }
    }

    // Methods
    action.restore = (restorePayload: boolean = true) => {
      if (settings.key) {
        dispatchRestoreAction(dispatch, settings.name, defaultState[settings.key], Boolean(settings.apiCall), restorePayload)
      }

    }

    action.delay = (delay: number, ...args: any[]) => {
      setTimeout(() => {
        action(...args)
      }, delay);
    }

    action.stop = () => {
      //console.log ('stop')
    }

    action.withCallback = async (...args: any[]) => {
      const callArguments = args.slice(0, args.length - 2)
      const callback = args[args.length - 1]

      const result = await action(...callArguments)

      if (isFunction(callback)) {
        callback(result)
      }
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
