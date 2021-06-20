import { isLocalStorageEnabled } from '../utils/misc';

const memoryStorage = new Map();
const isEnabled = isLocalStorageEnabled()

const set = (key: string, value: any) => {
  if (isEnabled) {
    window.localStorage.setItem(key, value);
  } else {
    memoryStorage.set(key, value);
  }
};

const get = (key: string, defaultValue?: string) => {
  const value = isEnabled ? window.localStorage.getItem(key) : memoryStorage.get(key);

  if (value === 'true' || value === 'false') {
    return value === 'true'
  }

  return typeof value !== 'undefined' ? value : defaultValue
}

const remove = (key: string) => {
  if (isEnabled) {
    window.localStorage.removeItem(key);
  } else {
    memoryStorage.delete(key);
  }
};

export default {
  set,
  get,
  remove,
  ...window.localStorage
};
