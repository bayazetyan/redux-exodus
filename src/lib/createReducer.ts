import { Action } from 'redux';
import { CreateActionWrapper } from './createAction';
import Actions from '../services/Actions';
import { hasKey } from '../utils/misc';

type DefaultActions<T extends keyof any> = {
  [P in T]: CreateActionWrapper
}

export default function createReducer<T extends keyof any>(actions: DefaultActions<T>, defaultState:  Record<string, any>, storeKey?: string) {
  let handlers = {}
  let actionsName: Record<string, string> = {}

  Object.keys(actions).forEach(key => {
    const a = hasKey(actions, key) ? actions[key] : null

    if (a) {
      if (a.reducerHandler) {
        const b = a.reducerHandler
        Actions.setAction({[key]: a})

        a.saveDefaultData(defaultState)
        actionsName = {...actionsName, ...a.storeKey}
        handlers = { ...handlers, ...b }
      } else {
        Actions.setAction({[key]: a})
      }
    }
  });

  function combineReducers(handlers: Record<string, (state: Object, action: Action) => Object>) {
    return (prevState: Object, value: Action) => Object.keys(handlers).reduce((newState: Object, keys: string) => {
      const keyValues = keys.split('|');
      if (keyValues.includes(value.type)) {
        return handlers[keys](newState, value);
      }

      return newState;
    }, prevState);
  }

  function createDefaultState() {
    const state: Record<string, any> = {}

    Object.keys(defaultState).forEach((key: string) => {
      state[key] = { payload: defaultState[key] }
    })

    return state
  }

  return (s: any, action: Action) => {
    const reducer = combineReducers(handlers);
    const state = s || createDefaultState();

    return reducer(state, action);
  }
}
