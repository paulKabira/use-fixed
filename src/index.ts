import { useMemo, useRef } from 'react';

/**
 * Creates a `getter` for the given value. When this getter is called,
 * it will always return the latest value of the given variable.
 *
 * @param data The value to create a getter for.
 */
export function useFixedGetter<T>(data: T): () => T {
  const ref = useRef<T>(data);
  ref.current = data;
  return useMemo(() => () => ref.current, []);
}

/**
 * Convert a callback to `fixed`. The reference of the returned callback never
 * changes even if the original callback itself changes.
 *
 * @param callback Callback to convert.
 */
export function useFixedCallback<T extends (...args: any[]) => any>(callback: T): T {
  const inject = useFixedGetter(callback);
  return useMemo(() => ((...args) => checkCallback(inject())(...args)) as T, []);
}

/**
 * Check if the given value is a callable and return the same. If not,
 * then throw an error.
 */
function checkCallback(callable: any): CallableFunction {
  if (typeof callable !== 'function')
    throw new Error('The parameter of useFixedCallback has to be a callable.');
  return callable;
}
