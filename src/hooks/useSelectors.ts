import { useSelector as _useSelector } from 'react-redux'

export function useSelector<T>(path: string, equalityFn?: (left: unknown, right: unknown) => boolean): T {
  return _useSelector<any, T>((state: any): T => {
    // @ts-ignore
    return path.split('.').reduce((a: Object, b: string) => a && a[b], state)
  }, equalityFn)
}
