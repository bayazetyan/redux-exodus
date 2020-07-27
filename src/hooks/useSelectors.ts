import { useSelector as _useSelector } from 'react-redux'

export function useSelector(path: string, equalityFn?: (left: unknown, right: unknown) => boolean) {
  return _useSelector((state) => {
    // @ts-ignore
    return path.split('.').reduce((a: Object, b: string) => a && a[b], state)
  }, equalityFn)
}
