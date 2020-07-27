export function isNull(value: any): value is null {
  return value === null;
}

export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}

export function isObject(value: any): value is Object {
  return typeof value === 'object' && !isArray(value) && !isNull(value);
}

export function cloneObject(value: Object) {
  const stringify = JSON.stringify(value)

  return JSON.parse(stringify)
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export const isLocalStorageEnabled = (): boolean => {
  try {
    const mod = '__storage_test__';
    window.localStorage.setItem(mod, mod);
    window.localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
};