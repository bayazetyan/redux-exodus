import { Action, ActionSettings } from './createAction';
import {
  dispatchAction,
  dispatchErrorAction,
  dispatchPendingAction,
  dispatchSuccessAction,
  generateCRUDActionName
} from '../utils/action-utils';
import { Dispatch } from 'redux';
import { CRUD_ACTIONS } from '../constants';
import Exodus from './index';
import EventEmitter from '../helpers/eventEmitter';
import { hasKey } from '../utils/misc';
import { getReducer } from './reducers/getReducer';
import { addReducer } from './reducers/addReducer';
import { updateReducer } from './reducers/updateReducer';
import { deleteReducer } from './reducers/deleteReducer';
import { getResponse } from '../helpers/handleResponse';

const DEFAULT_SETTINGS = {
  name: 'ACTION',
  forceUpdate: true,
  merge: () => false,
}

export interface APICalls<T = any> {
  get?: (...args: any[]) => Promise<T>
  create?: (...args: any[]) => Promise<T>
  update?: (...args: any[]) => Promise<T>
  delete?: (...args: any[]) => Promise<T>
}


export interface CreateCRUDActionWrapper {
  reducerHandler: {
    [key: string]: (state: Object, action: Action) => Object
  },
  saveDefaultData: (defaultState: Record<string, any>) => void,
  storeKey: {
    [key: string]: string
  },
  (dispatch: Dispatch): Function
}

export interface CRUDActionSettings<T = any> extends ActionSettings {
  updateKey?: string | number
  localUpdate?: boolean
  apiCalls: APICalls<T>
}

export interface CreateCRUDAction {
  (): void
}

function createCRUDAction(settings: CRUDActionSettings): CreateCRUDActionWrapper {
  const actionNames = generateCRUDActionName(settings.name, settings.apiCalls)
  let defaultState: any;

  function wrapper(dispatch: Dispatch): CreateCRUDAction {
    let dynamicSettings = {}

    function setSettings(_settings: CRUDActionSettings | null) {
      if (_settings) {
        dynamicSettings = _settings
      } else {
        dynamicSettings = {}
      }
    }

    async function action(crudType: CRUD_ACTIONS = CRUD_ACTIONS.GET, ...args: any[]) {
      if (hasKey(settings.apiCalls, crudType)) {
        dispatchPendingAction({
          args,
          dispatch,
          name: settings.name,
          crudActionType: crudType,
        })
        try {
          const response = await settings.apiCalls[crudType]?.apply(null, args)
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
              crudActionType: crudType,
            })

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
              error: _response?.error || response?.errors,
              crudActionType: crudType,
            })
            if (settings.onError) {
              settings.onError({
                dispatch,
                result: _response?.error || response?.errors,
              })
            }

            EventEmitter.emit('onError', {
              name: settings.name,
              action: (...newArgs: any[]) => createCRUDAction(settings)(dispatch).apply(newArgs.length > 0 ? newArgs : args),
              result: response?.error || response?.errors || _response,
            })
            // clear dynamic settings
            setSettings(null)
            return response
          }
        } catch (err) {
          dispatchErrorAction({
            dispatch,
            error: err,
            name: settings.name,
            crudActionType: crudType,
          })
          if (settings.onError) {
            settings.onError({
              dispatch,
              result: err,
            })
          }

          EventEmitter.emit('onError', {
            result: err,
            name: settings.name,
            action: (...newArgs: any[]) => createCRUDAction(settings)(dispatch).apply(newArgs.length > 0 ? newArgs : args),
          })
          // clear dynamic settings
          setSettings(null)
          return err
        }
      } else {
        const result = settings.handleResponse
          ? await settings.handleResponse(args[0])
          : args[0]

        dispatchAction({
          dispatch,
          payload: result,
          name: settings.name,
          crudActionType: crudType,
        })
        if (settings.onSuccess) {
          settings.onSuccess({
            result: args[0],
            dispatch,
          })
        }
      }
    }

    action.get = async (...args: any[]) => {
      return action(CRUD_ACTIONS.GET, ...args)
    }
    action.create = async (...args: any[]) => {
      return action(CRUD_ACTIONS.CREATE, ...args)
    }
    action.update = async (idKey: string | number, ...args: any[]) => {
      return action(CRUD_ACTIONS.UPDATE, idKey, ...args)
    }
    action.delete = async (idKey: string | number, ...args: any[]) => {
      return action(CRUD_ACTIONS.DELETE, idKey, ...args)
    }

    action.settings = (settings: CRUDActionSettings) => {
      setSettings(settings)
      return action
    }

    return action
  }

  wrapper.reducerHandler = {
    [actionNames.get]: settings?.reducer || getReducer({...DEFAULT_SETTINGS, ...settings}),
    [actionNames.create]: settings?.reducer || addReducer({...DEFAULT_SETTINGS, ...settings}),
    [actionNames.update]: settings?.reducer || updateReducer({...DEFAULT_SETTINGS, ...settings}),
    [actionNames.delete]: settings?.reducer || deleteReducer({...DEFAULT_SETTINGS, ...settings}),
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


export default Object.freeze(createCRUDAction)
