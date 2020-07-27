export const ERROR_TEXT_START = 'bindActionCreators expected an object or a function, instead received';
export const ERROR_TEXT_END = 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?';

export enum PAYLOAD_STATUS {
  ERROR,
  PENDING,
  SUCCESS,
  RESTORE,
}

export const STATUS_PREFIX = {
  [PAYLOAD_STATUS.ERROR]: '_ERROR',
  [PAYLOAD_STATUS.PENDING]: '_PENDING',
  [PAYLOAD_STATUS.SUCCESS]: '_SUCCESS',
  [PAYLOAD_STATUS.RESTORE]: '_RESTORE',
}
