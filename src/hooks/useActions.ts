import { useMemo } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { hasKey, isArray, isFunction, isObject } from '../utils/misc';
import Actions from '../services/Actions';
import { CreateAction } from '../lib/createAction';

function bindActionCreator(actionCreator: Function, dispatch: Dispatch) {
  return actionCreator(dispatch);
}
export function useActions<T = any>(actions?: any) {
  const dispatch = useDispatch();

  return useMemo<{ [key in keyof T]: CreateAction }>(() => {
    if (actions) {
      if (isArray(actions)) {
        return actions.map(a => bindActionCreator(a, dispatch));
      } else if (isObject(actions)) {
        let keys = Object.keys(actions);
        let boundActionCreators: { [key: string]: CreateAction } = {};

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
    } else {
      const actions = Actions.getAllActions<T>()
      let keys = Object.keys(actions);
      let boundActionCreators: { [key in keyof T]?: CreateAction } = {};

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (hasKey(actions, key)) {
          let actionCreator = actions[key];

          if (isFunction(actionCreator)) {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
          }
        }
      }

      return boundActionCreators;
    }
  }, [actions, dispatch]);
}
