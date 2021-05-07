import { useLayoutEffect, useMemo, useRef } from 'react';
/**
 * Creates a `getter` for the given value. When this getter is called,
 * it will always return the latest value of the given variable in the
 * commit phase. Use `getter.n()` to get the latest value of the
 * given data in render phase.
 *
 * @param data The value to create a getter for.
 */
export function useFixedGetter<T>(data: T): FixedGetter<T> {
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
export function useFixedCallback<T extends (...args: any[]) => any>(callback: T): FixedCallback<T> {
  const getLatestCb = useFixedGetter(callback);
  return useMemo(() => {
    // Patch the callback to execute, instead of getting the latest value.
    const patchedCb = (...a: Parameters<T>) => checkCallback(getLatestCb())(...a);
    patchedCb.n = (...a: Parameters<T>) => checkCallback(getLatestCb.n())(...a);
    return patchedCb as FixedCallback<T>;
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

/**
 * A function that gets the latest value of the given data.
 * `FixedGetter.n` gives the latest value in `render context`.
 */
export interface FixedGetter<T> {
  /**
   * Get the value from the latest commit phase.
   */
  (): T;
  /**
   * Get the value from the latest render phase.
   */
  n: () => T;
}

/**
 * Get the latest callback to use anywhere. Use `FixedCallback.n`, having
 * the same signature, to get the latest value in render phases.
 */
export interface FixedCallback<T extends (...a: any) => any> {
  /**
   * Call the function from the latest commit phase.
   */
  (...a: Parameters<T>): ReturnType<T>;
  /**
   * Call the function from the latest render phase.
   */
  n: (...a: Parameters<T>) => ReturnType<T>;
}
