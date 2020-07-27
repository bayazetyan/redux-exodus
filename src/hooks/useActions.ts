import { useMemo } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { isArray, isFunction, isObject } from '../utils/misc';

function bindActionCreator(actionCreator: Function, dispatch: Dispatch) {
  return actionCreator(dispatch);
}
export function useActions(actions: any) {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (isArray(actions)) {
      return actions.map(a => bindActionCreator(a, dispatch));
    } else if (isObject(actions)) {
      let keys = Object.keys(actions);
      let boundActionCreators: { [key: string]: Function } = {};

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let actionCreator = actions[key];

        if (isFunction(actionCreator)) {
          boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
      }

      return boundActionCreators;
    }
    return bindActionCreators(actions, dispatch);
  }, [actions, dispatch]);
}
