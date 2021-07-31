import { Action, CombinedState, Reducer } from 'redux';

export function createRootReducer (appReducer: Reducer<CombinedState<any>>) {
  return (state: any, action: Action) => {
    if (action.type === '@EXODUS_RESET_STORE') {
      return appReducer(undefined, action)
    }

    return appReducer(state, action)
  }
}
