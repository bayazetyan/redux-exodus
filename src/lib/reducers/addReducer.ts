import { Action } from '../createAction';
import { isArray, isObject } from '../../utils/misc';
import { CRUDActionSettings } from '../createCRUDAction';

export function addReducer(settings: CRUDActionSettings) {
  const { key, updateKey = 'id', localUpdate } = settings
  return (state: any, action: Action) => {
    let payload = key ? state[key].payload : {}
    const [_data]  = action.apiCallArguments
    const actionPayload = localUpdate ? _data : action.data.payload

    if (key) {
      if (isObject(state[key].payload) && action.data.status === 2) {
        payload = {
          ...state[key].payload,
          [action.data.payload[updateKey]]: actionPayload,
        }
      }

      if (isArray(state[key].payload) && action.data.status === 2) {
        payload = [
          ...state[key].payload,
          actionPayload,
        ]
      }

      return {
          ...state,
          [key]: {
            ...state[key],
            ...action.data,
            payload,
          }
        }
    }

    return state
  }
}
