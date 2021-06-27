import LocaleStorage from './localeStorage';
import { Store } from 'redux';
import { PAYLOAD_STATUS } from '../constants';

interface IStorage {
  get: (key: string, defaultValue?: string) => string | Boolean | Promise<string | Boolean | undefined>
  set: (key: string, value: string) => void | Promise<void>
  remove: (key: string) => void
}

class Storage {
  public isNative: boolean = false
  public storage : IStorage | any = LocaleStorage
  public test: any

  constructor() {
    if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
      this.isNative = true
    }

    this.storage = LocaleStorage
  }

  getStorageKeys = async () => {
    return await this.storage.getAllKeys()
  }

  persistsStore = (store: Store) => {
    ;(async () => {
      if (this.isNative) {
        const storageKeys = await this.getStorageKeys()
        const keys = storageKeys.filter((key: string) => key.includes('@_EXODUS_'))

        const _data = await this.storage.multiGet(keys)
        for (const d of _data) {
          store.dispatch({
            type: d[0].split("@_EXODUS_")[1],
            data: {
              payload: JSON.parse(d[1]),
              error: null,
              status: PAYLOAD_STATUS.SUCCESS,
            }
          })
        }
      } else {
        const storageKeys = Object.entries<string | undefined>(this.storage).filter(key => key[0].includes('@_EXODUS_'))
        for (const d of storageKeys) {
          if ((d[1])){
            store.dispatch({
              type: d[0].split("@_EXODUS_")[1],
              data: {
                payload: JSON.parse(d[1]),
                error: null,
                status: PAYLOAD_STATUS.SUCCESS,
              }
            })
          }
        }
      }
    })()
  }

  setStorage = (storage: any) => {
    this.storage = storage
  }

  get = async (key: string, defaultValue?: string) =>  {
    const result = this.isNative
      ? await this.storage.getItem(key, defaultValue)
      : this.storage.get(key, defaultValue)

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
    if (this.isNative) {
      this.storage.setItem(key, JSON.stringify(value))
    } else {
      this.storage.set(key, JSON.stringify(value))
    }

  }
  remove = (key: string) => this.storage.remove(key)
}

export default new Storage()
