export function isNull(value: any): value is null {
  return value === null;
}

export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}

export function isObject(value: any): value is Object {
  return typeof value === 'object' && !isArray(value) && !isNull(value);
}