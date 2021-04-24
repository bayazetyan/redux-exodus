import { Action } from 'redux';
import { CreateActionWrapper } from './createAction';

export default function createReducer(actions: Record<string, CreateActionWrapper>, defaultState:  Record<string, any>, storeKey?: string) {
  let handlers = {}
  let actionsName: Record<string, string> = {}

  Object.values(actions).forEach(a => {
    const b = a.reducerHandler
    a.saveDefaultData(defaultState)
    actionsName = {...actionsName, ...a.storeKey}
    handlers = { ...handlers, ...b }
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

  return (s: Object, action: Action) => {
    const reducer = combineReducers(handlers);
    const state = s || createDefaultState();

    return reducer(state, action);
  }
}
