import EventEmitter from '../helpers/eventEmitter'

interface DefaultSettings {
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
