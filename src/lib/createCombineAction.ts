import { CreateActionWrapper } from './createAction';
import { Dispatch } from 'redux';

interface CombineActionSettings {
  actions: CreateActionWrapper[],
  waitAllResponse?: boolean
  ignoreRejection?: boolean
}

type ActionArguments = Record<string, any[]>

export function createCombineAction(settings: CombineActionSettings) {
  const { actions, waitAllResponse = false, ignoreRejection = false } = settings

  return (dispatch: Dispatch) => {
    function runAction(action: CreateActionWrapper, args: ActionArguments) {
      const actionKey = Object.keys(action.storeKey)[0]
      const actionArgs = args[actionKey]

      if (actionArgs) {
        return action(dispatch)(...actionArgs)
      }

      return action(dispatch)()
    }

    return (actionArguments: ActionArguments): Promise<any[]> => {
      if (waitAllResponse) {
        return Promise.allSettled(actions.map(action => runAction(action, actionArguments)))
      } else if (ignoreRejection) {
        return Promise.race(actions.map(action => runAction(action, actionArguments)))
      } else {
        return Promise.all(actions.map(action => runAction(action, actionArguments)))
      }
    }
  }
}
