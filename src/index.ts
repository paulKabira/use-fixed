import { useLayoutEffect, useMemo, useRef } from 'react';
import { LatestCallback, LatestGetter } from './types';

/**
 * Creates a `getter` for the given value. When this getter is called,
 * it will always return the latest value of the given variable.
 *
 * @param data The value to create a getter for.
 */
export function useFixedGetter<T>(data: T): LatestGetter<T> {
  const getterRef = useRef({ c: data, n: data });
  // Use layout effect here because, any references to the
  // latest values should be available in layout effects as
  // well.
  useLayoutEffect(() => {
    // Update values for commit phases.
    getterRef.current.c = data;
  });
  // Update value for render phases.
  getterRef.current.n = data;

  return useMemo(() => {
    const currentGetter = () => getterRef.current.c;
    currentGetter.n = () => getterRef.current.n;
    return currentGetter;
  }, []);
}

/**
 * Convert a callback to `fixed`. The reference of the returned callback never
 * changes even if the original callback itself changes.
 *
 * @param callback Callback to convert.
 */
export function useFixedCallback<T extends (...args: any[]) => any>(
  callback: T
): LatestCallback<T> {
  const getLatestCb = useFixedGetter(callback);
  return useMemo(() => {
    // Patch the callback to execute, instead of get the latest value.
    const patchedCb = (...a: Parameters<T>) => checkCallback(getLatestCb())(...a);
    patchedCb.n = (...a: Parameters<T>) => checkCallback(getLatestCb.n())(...a);
    return patchedCb as LatestCallback<T>;
  }, []);
}

/**
 * Check if the given value is a callable and return the same. If not,
 * then throw an error.
 */
function checkCallback<T extends (...args: any[]) => any>(callable: T): T {
  if (typeof callable !== 'function')
    throw new Error('The parameter of useFixedCallback has to be a callable.');
  return callable;
}
