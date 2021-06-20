export const ERROR_TEXT_START = 'bindActionCreators expected an object or a function, instead received';
export const ERROR_TEXT_END = 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?';

export enum PAYLOAD_STATUS {
  ERROR,
  PENDING,
  SUCCESS,
  RESTORE,
}

export enum CRUD_ACTIONS {
  GET= 'get',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const STATUS_PREFIX = {
  [PAYLOAD_STATUS.ERROR]: '_ERROR',
  [PAYLOAD_STATUS.PENDING]: '_PENDING',
  [PAYLOAD_STATUS.SUCCESS]: '_SUCCESS',
  [PAYLOAD_STATUS.RESTORE]: '_RESTORE',
}

export const CRUD_PREFIX = {
  [CRUD_ACTIONS.GET]: 'GET_',
  [CRUD_ACTIONS.CREATE]: 'CREATE_',
  [CRUD_ACTIONS.UPDATE]: 'UPDATE_',
  [CRUD_ACTIONS.DELETE]: 'DELETE_',
}
