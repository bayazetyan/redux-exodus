import { Action } from '../createAction';
import { isArray, isObject } from '../../utils/misc';
import { CRUDActionSettings } from '../createCRUDAction';

export function updateReducer(settings: CRUDActionSettings) {
  const { key, updateKey = 'id', localUpdate } = settings

  return (state: any, action: Action) => {
    const [idKey, _data]  = action.apiCallArguments
    let payload = key ? state[key].payload : {}
    const actionPayload = localUpdate ? _data : action.data.payload

    if (idKey && key) {
      if (isObject(state[key].payload) && action.data.status === 2) {
        payload = {
          ...state[key].payload,
          [idKey]: {
            ...state[key].payload[idKey],
            ...actionPayload
          },
        }
      }

      if (isArray(state[key].payload) && action.data.status === 2) {
        payload = state[key].payload.map((elem: any) => {
          if (elem[updateKey] === idKey) {
            return {
              ...elem,
              ...actionPayload
            }
          }

          return elem
        })
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
