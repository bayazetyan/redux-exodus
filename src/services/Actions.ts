import { CreateActionWrapper } from '../lib/createAction';

export type ActionList<T = any> = {
  [key in keyof T]-?: CreateActionWrapper
}

class Actions {
  static actions: ActionList

  static setAction = <T>(action: ActionList<T>) => {
    Actions.actions = {...Actions.actions, ...action}
  }

  static getAllActions = <T>(): ActionList<T>  => {
    return Actions.actions as ActionList<T>
  }

  static getAction = (name: string): CreateActionWrapper => {
    return Actions.actions[name]
  }
}

export default Actions
