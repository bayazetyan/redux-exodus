import EventEmitter from '../helpers/eventEmitter'

export function addListener(label: string, callback: Function) {
  EventEmitter.addListener(label, callback)
}

export function removeListener(label: string, callback: Function) {
  EventEmitter.removeListener(label, callback)
}