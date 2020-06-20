import { ActionSettings, Action } from './createAction';

export function getReducer(settings: ActionSettings) {
  const { keys, key } = settings
  const reducerKey = key || keys
 
  return (state: Object, action: Action) => {

    if (reducerKey) {
      
    }

    return {
      ...state,
      ...action.data,
    }
  }
}