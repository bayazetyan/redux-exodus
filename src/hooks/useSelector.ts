import { useSelector as _useSelector } from 'react-redux'
import { isFunction } from '../utils/misc';

type Selector<T> = (state: T) => T

export function useSelector<T>(selector: string | Selector<T>, equalityFn?: (left: unknown, right: unknown) => boolean): T {
  if (isFunction(selector)) {
    return _useSelector(selector, equalityFn)
  }

  return _useSelector<any, T>((state: any): T => {
    // @ts-ignore
    return selector.split('.').reduce((a: Object, b: string) => a && a[b], state)
  }, equalityFn)
}
