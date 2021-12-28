import { Action, CombinedState, Reducer } from 'redux';

type ExodusAction = Action & {
  payload: any
}

export function createRootReducer (appReducer: Reducer<CombinedState<any>>) {
  return (state: any, action: ExodusAction) => {
    if (action.type === '@EXODUS_RESET_STORE') {
      const { excludedReducers } = action.payload

      if (excludedReducers && excludedReducers.length) {
        const _state: Record<string, any> = {}

        excludedReducers.forEach((key: string) => {
          _state[key] = state[key]
        })

        return appReducer(_state, action)
      } else {
        return appReducer(undefined, action)
      }
    }

    return appReducer(state, action)
  }
}
