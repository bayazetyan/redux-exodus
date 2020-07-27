import LocaleStorage from './localeStorage';

interface IStorage {
  get: (key: string, defaultValue?: string) => string | Boolean | Promise<string | Boolean | undefined>
  set: (key: string, value: string) => void | Promise<void>
  remove: (key: string) => void
}

class Storage {
  private storage: IStorage

  constructor() {
    if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
      import('./asyncStorage').then(module => {
        this.storage = module
      })
    }

    this.storage = LocaleStorage
  }

  get = (key: string, defaultValue?: string) =>  {
    const result = this.storage.get(key, defaultValue)

    if (typeof result === 'string') {
      try{
        return JSON.parse(result)
      } catch(e) {
        return result
      }
    }

    return result
  }

  set = (key: string, value: string) => {
    this.storage.set(key, JSON.stringify(value))
  }
  remove = (key: string) => this.storage.remove(key)
}

export default new Storage()
