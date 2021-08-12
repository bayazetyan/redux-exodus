import { Dispatch } from 'redux';

import { CRUD_ACTIONS, CRUD_PREFIX, PAYLOAD_STATUS, STATUS_PREFIX } from '../constants';
import { APICalls } from '../lib/createCRUDAction';
import { hasKey } from './misc';
import Storage from '../services/Storage';


export function generateActionName(name: string): string {
  if (name) {
    let value = '';
    const statusPrefix = Object.values(STATUS_PREFIX);

    statusPrefix.forEach((prefix: string, index: number) => {
      value = `${value}${name}${prefix}${index < statusPrefix.length - 1 ? '|' : ''}`;
    });

    return value;
  }
  return ''
}

export function generateCRUDActionName(name: string, apiCalls: APICalls): Record<keyof APICalls, string> {
  const actions: Record<keyof APICalls, string> = {
    get: '',
    create: '',
    update: '',
    delete: '',
  }

  if (name) {
    const statusPrefix = Object.values(STATUS_PREFIX);
    const crudPrefix = Object.values(CRUD_PREFIX);

    crudPrefix.forEach((crudPrefix, i) => {
      let value = '';
      const key = crudPrefix.replace('_', '').toLocaleLowerCase() as keyof APICalls

      statusPrefix.forEach((prefix: string, index: number) => {
        if (hasKey(apiCalls, key)) {
          if (prefix === STATUS_PREFIX[PAYLOAD_STATUS.RESTORE]
            && crudPrefix !== CRUD_PREFIX[CRUD_ACTIONS.GET]
          ) {
            return
          }
          const length = crudPrefix === CRUD_PREFIX[CRUD_ACTIONS.GET] ? statusPrefix.length - 1 : statusPrefix.length - 2

          value = `${value}${crudPrefix}${name}${prefix}${index < length ? '|' : ''}`;
        }
      });
      actions[key] = value
    })
  }

  return actions
}

export function getActionName(name: string, status: PAYLOAD_STATUS, crudActionType?: CRUD_ACTIONS) {
  if (crudActionType) {
    return CRUD_PREFIX[crudActionType] + name + STATUS_PREFIX[status]
  }

  return name + STATUS_PREFIX[status];
}

export type DispatchActionsArgs = {
  name: string
  args?: any[]
  error?: any
  payload?: any
  dynamicSettings?: any
  crudActionType?: CRUD_ACTIONS
  dispatch: Dispatch
  hasApiCall?: boolean
  restorePayload?: boolean
}

function persistData(payload: any, type: string, persists?: boolean) {
  ;(async () =>{
    const storedData = await Storage.get('@_EXODUS_' + type)
    if (persists) {
      if (!storedData || (JSON.stringify(payload) !== JSON.stringify(storedData))) {
        Storage.set('@_EXODUS_' + type, payload)
      }
    }
  })()
}

export function removePersistedData(name: string, persists?: boolean) {
  const type = getActionName(name, PAYLOAD_STATUS.SUCCESS)

  ;(async () =>{
    const storedData = await Storage.get('@_EXODUS_' + type)
    if (storedData && !persists) {
      Storage.remove('@_EXODUS_' + type)
    }
  })()
}

export function dispatchPendingAction({dispatch, name, args, crudActionType}: DispatchActionsArgs) {
  dispatch({
    type: getActionName(name, PAYLOAD_STATUS.PENDING, crudActionType),
    apiCallArguments: args,
    data: {
      status: PAYLOAD_STATUS.PENDING,
      error: null,
    }
  })
}

export function dispatchSuccessAction({dispatch, dynamicSettings, name, payload, args, crudActionType}: DispatchActionsArgs, persists?: boolean) {
  const type = getActionName(name, PAYLOAD_STATUS.SUCCESS, crudActionType)
  dispatch({
    type: type,
    apiCallArguments: args,
    dynamicSettings,
    data: {
      payload,
      error: null,
      status: PAYLOAD_STATUS.SUCCESS,
    }
  })

  persistData(payload, type, persists)
}

export function dispatchAction({dispatch, name, payload, crudActionType}: DispatchActionsArgs, persists?: boolean) {
  const type = getActionName(name, PAYLOAD_STATUS.SUCCESS, crudActionType)
  dispatch({
    type,
    data: {
      payload,
    }
  })

  persistData(payload, type, persists)
}

export function dispatchErrorAction({dispatch, name, error, crudActionType}: DispatchActionsArgs) {
  dispatch({
    type: getActionName(name, PAYLOAD_STATUS.ERROR, crudActionType),
    data: {
      status: PAYLOAD_STATUS.ERROR,
      error,
    }
  })
}

export function dispatchRestoreAction({
  name,
  payload,
  dispatch,
  hasApiCall,
  restorePayload,
  crudActionType,
}: DispatchActionsArgs) {
  if (hasApiCall) {
    if (restorePayload) {
      dispatch({
        type: getActionName(name, PAYLOAD_STATUS.RESTORE, crudActionType),
        data: {
          payload,
          error: null,
          status: PAYLOAD_STATUS.SUCCESS,
        }
      })
    } else {
      dispatch({
        type: getActionName(name, PAYLOAD_STATUS.RESTORE, crudActionType),
        data: {
          error: null,
          status: PAYLOAD_STATUS.SUCCESS,
        }
      })
    }

  } else {
    dispatch({
      type: getActionName(name, PAYLOAD_STATUS.RESTORE, crudActionType),
      data: {
        payload,
      }
    })
  }

}
