import { Dispatch } from 'redux';

import { PAYLOAD_STATUS, STATUS_PREFIX } from '../constants';


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

export function getActionName(name: string, status: PAYLOAD_STATUS) {
  return name + STATUS_PREFIX[status];
}

export function dispatchPendingAction(dispatch: Dispatch, name: string, args: any[]) {
  dispatch({
    type: getActionName(name, PAYLOAD_STATUS.PENDING),
    apiCallArguments: args,
    data: {
      status: PAYLOAD_STATUS.PENDING,
      error: null,
    }
  })
}

export function dispatchSuccessAction(dispatch: Dispatch, name: string, payload: any, args: any[]) {
  dispatch({
    type: getActionName(name, PAYLOAD_STATUS.SUCCESS),
    apiCallArguments: args,
    data: {
      payload,
      error: null,
      status: PAYLOAD_STATUS.SUCCESS,
    }
  })
}

export function dispatchAction(dispatch: Dispatch, name: string, payload: any) {
  dispatch({
    type: getActionName(name, PAYLOAD_STATUS.SUCCESS),
    data: {
      payload,
    }
  })
}

export function dispatchErrorAction(dispatch: Dispatch, name: string, error: any) {
  dispatch({
    type: getActionName(name, PAYLOAD_STATUS.ERROR),
    data: {
      status: PAYLOAD_STATUS.ERROR,
      error,
    }
  })
}

export function dispatchRestoreAction(dispatch: Dispatch, name: string, payload: any, hasApiCall: boolean, restorePayload: boolean) {
  if (hasApiCall) {
    if (restorePayload) {
      dispatch({
        type: getActionName(name, PAYLOAD_STATUS.RESTORE),
        data: {
          payload,
          error: null,
          status: PAYLOAD_STATUS.SUCCESS,
        }
      })
    } else {
      dispatch({
        type: getActionName(name, PAYLOAD_STATUS.RESTORE),
        data: {
          error: null,
          status: PAYLOAD_STATUS.SUCCESS,
        }
      })
    }
    
  } else {
    dispatch({
      type: getActionName(name, PAYLOAD_STATUS.RESTORE),
      data: {
        payload,
      }
    })
  }
  
}
