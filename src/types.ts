/**
 * A function that gets the latest value of the given data.
 * `LatestGetter.n` gives the latest value in `render context`.
 */
export interface LatestGetter<T> {
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
 * Get the latest callback to use anywhere. Use `LatestCallback.n`, having
 * the same signature, to get the latest value in render phases.
 */
export interface LatestCallback<T extends (...a: any) => any> {
  /**
   * Call the function from the latest commit phase.
   */
  (...a: Parameters<T>): ReturnType<T>;
  /**
   * Call the function from the latest render phase.
   */
  n: (...a: Parameters<T>) => ReturnType<T>;
}
