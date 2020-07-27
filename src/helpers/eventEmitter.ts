import { isFunction } from '../utils/misc'

class EventEmitter {
  private listeners: Map<string, Function[]>

  constructor() {
    this.listeners = new Map()
  }

  addListener = (label: string, callback: Function) => {
    this.listeners.has(label) || this.listeners.set(label, [])
    this.listeners.get(label)?.push(callback)
  }

  removeListener = (label: string, callback: Function) => {
    let index
    let listeners = this.listeners.get(label)

    if (listeners && listeners.length) {
      index = listeners.reduce((i: number, listener: Function, index: number) => {
        return (isFunction(listener) && listener === callback) ?
          i = index :
          i;
      }, -1)

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(label, listeners);
        return true;
      }
    }

    return false
  }

  emit = (label: string, ...args: any) => {
    let listeners = this.listeners.get(label)

    if (listeners && listeners.length) {
      listeners.forEach(listener => {
        listener(...args)
      })
      return true
    }
    return false
  }
}

export default new EventEmitter()
