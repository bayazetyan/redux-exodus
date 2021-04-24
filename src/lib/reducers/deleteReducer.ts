import { Action } from '../createAction';
import { isArray, isObject } from '../../utils/misc';
import { CRUDActionSettings } from '../createCRUDAction';

export function deleteReducer(settings: CRUDActionSettings) {
  const { key, updateKey = 'id', localUpdate } = settings

  return (state: any, action: Action) => {
    let payload
    const [idKey]  = action.apiCallArguments

    if (idKey && key) {
      const arrayState = isArray(state[key].payload)

      if (arrayState) {
        payload = key ? [...state[key].payload] : {}
      } else {
        payload = key ? {...state[key].payload} : {}
      }


      if (isObject(state[key].payload) && action.data.status === 2) {
        delete payload[idKey]
      }

      if (isArray(state[key].payload) && action.data.status === 2) {
        payload = state[key].payload.filter((i: any) => i[updateKey] !== idKey)
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
