import { CreateActionWrapper } from '../lib/createAction';
import { CreateCRUDActionWrapper } from '../lib/createCRUDAction';

export type ActionList<T = any> = {
  [key in keyof T]-?: CreateActionWrapper | CreateCRUDActionWrapper
}

class Actions {
  static actions: ActionList

  static setAction = <T>(action: ActionList<T>) => {
    Actions.actions = {...Actions.actions, ...action}
  }

  static getAllActions = <T>(): ActionList<T>  => {
    return Actions.actions as ActionList<T>
  }

  static getAction = (name: string): CreateActionWrapper | CreateCRUDActionWrapper => {
    return Actions.actions[name]
  }
}

export default Actions
