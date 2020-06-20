import { Dispatch } from 'redux';
import { ERROR_TEXT_START, ERROR_TEXT_END } from '../constants';

const getErrorText = (actionCreators: {[key: string]: Function}): string => {
  const actionCreatorsType = actionCreators === null ? 'null' : typeof actionCreators;

  return `${ERROR_TEXT_START} ${actionCreatorsType} ${ERROR_TEXT_END}`;
};

const bindActionCreator = (actionCreator: Function, dispatch: Dispatch) => {
  return actionCreator(dispatch);
};

export const bindComplexActionCreators = (actionCreators: Function, dispatch: Dispatch) => {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(getErrorText(actionCreators));
  }

  let keys = Object.keys(actionCreators);
  let boundActionCreators: { [key: string]: Function } = {};

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
};