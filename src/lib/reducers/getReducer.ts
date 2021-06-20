import { ActionSettings, Action } from '../createAction';
import { isObject, isArray, cloneObject } from '../../utils/misc';
//import Storage from '../../services/Storage'

function reduceData(keys: string[], state: any, action: Action) {
  const transformKeys = [...keys]
  const data = cloneObject(state[keys[0]])
  transformKeys.splice(0, 1, 'payload')

  transformKeys.reduce((value, key, index) => {
    if (value[key] && !isObject(value[key]) && !isArray(value[key])) {
      value[key] = action.data?.payload
    } else {
      if (value[key] !== undefined && index === transformKeys.length - 1) {
        value[key] = {...value[key], ...action.data?.payload}
      } else if (value[key] === undefined && index === transformKeys.length - 1) {
        value[key] = action.data?.payload
      } else if (value[key]) {
        return value[key]
      } else {
        value[key] = {}
      }
    }

    return value[key]
  }, data)

  return {
    ...action.data,
    payload: data.payload
  }
}

export function mergeData(key: string,state: any, action: Action) {
  if (action.type.includes('RESTORE')) {
    return {
      ...state[key],
      ...action.data,
      payload: action.data.payload,
    }
  } else {
    let payload = action.data.payload

    if (isObject(action.data.payload)) {
      payload = {
        ...state[key].payload,
        ...action.data.payload,
      }
    }

    if (isArray(action.data.payload)) {
      payload = [
        ...state[key].payload,
        ...action.data.payload,
      ]
    }

    return {
      ...state[key],
      ...action.data,
      payload,
    }
  }
}

export function getReducer(settings: ActionSettings) {
  const { keys, key, forceUpdate, merge, persists, name } = settings

  return (state: any, action: Action) => {
    const isPrime = !isObject(action.data.payload) && !isArray(action.data.payload)

    if (key) {
      const _forceUpdate = forceUpdate && !(merge && merge(...action?.apiCallArguments))
      const result = isPrime || _forceUpdate ? {
        ...state[key],
        ...action.data,
      } : mergeData(key, state, action)

      return {
        ...state,
        [key]: result
      }
    } else if (keys) {
      const result = {
        ...state[keys[0]],
        ...reduceData(keys, state, action)
      }

      return {
        ...state,
        [keys[0]]: result
      }
    }

    return {
      ...state,
      ...action.data,
    }
  }
}
