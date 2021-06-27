import { useSelector as _useSelector } from 'react-redux'
import { isFunction } from '../utils/misc';

type Selector<S, T> = (state: S) => T

export function useSelector<S, T>(selector: string | Selector<S, T>, equalityFn?: (left: unknown, right: unknown) => boolean): T {
  if (isFunction(selector)) {
    return _useSelector(selector, equalityFn)
  }

  return _useSelector<S, T>((state: S): T => {
    // @ts-ignore
    return selector.split('.').reduce((a: Object, b: string) => a && a[b], state)
  }, equalityFn)
}
