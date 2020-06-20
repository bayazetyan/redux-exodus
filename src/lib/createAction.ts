import { Dispatch } from 'redux';
import { dispatchPendingAction, dispatchRestoreAction, dispatchErrorAction, dispatchSuccessAction, generateActionName } from '../utils/action-utils';
import { getReducer } from './getReducer';

type EventArguments = {
  result: any,
  dispatch: Dispatch
  state?: Object,
}

export interface Action {
  type: string,
  data: {
    payload?: any
    status: number
    error?: string | string[]
  }
}

export interface CreateActionWrapper {
  reducerHandler: {
    [key: string]: (state: Object, action: Action) => Object
  }
}

export interface CreateAction {
  delay: (delay: number, ...args: any[]) => void
}

export interface ActionSettings {
  name: string
  key?: string
  keys?: string[]
  payload?: any[]
  groupBy?: string
  debounce?: number
  returnResponse?: boolean
  merge?: (...args: any[]) => boolean
  apiCall?: (...args: any[]) => Promise<any>

  // methods
  onSuccess?: (data: EventArguments) => void
  onError?: (data: EventArguments) => void
  reducer?: (state: Object, payload: Action) => void
  dataParse?: (data: any) => any
}


export default function createAction(settings: ActionSettings): CreateActionWrapper {
  const actionName = generateActionName(settings.name)

  function wrapper(dispatch: Dispatch): CreateAction {
    async function action(...args: any[]) {
      if (settings.apiCall) {
        dispatchPendingAction(dispatch, settings.name)
        try {
          const response = await settings.apiCall.apply(null, args)
          
          if (response instanceof Response && response.ok) {
            const result = response?.json() || response?.text()

            dispatchSuccessAction(dispatch, settings.name, result)
            if (settings.onSuccess) {
              settings.onSuccess({
                result,
                dispatch,
              })
            }
          } else if (response) {
            dispatchSuccessAction(dispatch, settings.name, response)
            if (settings.onSuccess) {
              settings.onSuccess({
                dispatch,
                result: response,
              })
            }
          } else {
            dispatchErrorAction(dispatch, settings.name, response.error)
            if (settings.onError) {
              settings.onError({
                dispatch,
                result: response.error,
              })
            }
          }
        } catch (err) {
          dispatchErrorAction(dispatch, settings.name, err)
          if (settings.onError) {
            settings.onError({
              dispatch,
              result: err,
            })
          }
        }
      } else {

      }
    }

    // Methods
    action.restore = () => {
      dispatchRestoreAction(dispatch, settings.name, {})
    }

    action.delay = (delay: number, ...args: any[]) => {
      setTimeout(() => {
        console.log('::::: LOG ::::: args', args);
        action(...args)
      }, delay);
    }

    action.stop = () => {
      console.log ('stop')
    }

    action.withCallback = (args: any[], data: EventArguments) => {
      console.log ('stop')
    }

    return action
  }

  // reducers
  wrapper.reducerHandler = {
    [actionName]: getReducer(settings)
  }

  return wrapper
}
