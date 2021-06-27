import EventEmitter from '../helpers/eventEmitter'
import Storage from '../services/Storage';
import { Store } from 'redux';

interface DefaultSettings {
  storage?: any
  store?: Store
  handleResponse?: (data: any) => any
  onError?: (data: { name: string, result: any }) => void
}

class Exodus {
  public defaultSettings: DefaultSettings

  constructor() {
    this.defaultSettings = {}
  }

  public init = (defaultSettings: DefaultSettings) => {
    this.defaultSettings = defaultSettings

    if (defaultSettings.storage) {
      Storage.setStorage(defaultSettings.storage)
    }

    if (defaultSettings.store) {
      Storage.persistsStore(defaultSettings.store)
    }

    if (defaultSettings.onError) {
      EventEmitter.addListener('onError', defaultSettings.onError)
    }
  }

  public updateSettings = (settings: DefaultSettings) => {
    this.defaultSettings = {
      ...this.defaultSettings,
      ...settings
    }
  }
}

export default new Exodus()
