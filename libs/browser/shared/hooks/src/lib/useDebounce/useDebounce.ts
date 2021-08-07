import { useRef } from 'react';

import { useSleep } from '../useSleep';

export interface DebouncedFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invokation, or undefined if the debounced
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invokation of the debounced function.
   */
  cancel(): void;

  /**
   * If there is a pending invokation of the debounced function, invoke it immediately and return
   * its return value.
   *
   * Otherwise, return the value from the last invokation, or undefined if the debounced function
   * was never invoked.
   */
  flush(): ReturnType<T> | undefined;
}

/**
 * provide a debounce method for debounce method
 * @param fn method for debounce
 * @param debounceTime debounce timeout value, default is  `200`ms
 */
export const useDebounce = <F extends (...args: any[]) => any>(
  fn: F,
  debounceTime: number = 200,
) => {
  const flushRef = useRef(false);
  const resultRef = useRef<ReturnType<F>>();
  const lastArgs = useRef<any[]>();
  const { sleep, cancel } = useSleep();

  const invokeFunc = () => {
    const args = lastArgs.current || [];

    resultRef.current = fn(...args);
    lastArgs.current = undefined;

    return resultRef.current;
  };

  const debounced = async (...args: any[]) => {
    flushRef.current = false;
    lastArgs.current = args;
    try {
      await sleep(debounceTime);
      return invokeFunc();
    } catch (e) {
      return;
    }
  };

  debounced.cancel = cancel;

  debounced.flush = () => {
    flushRef.current = true;
    cancel();

    if (lastArgs.current) {
      invokeFunc();
    }

    return resultRef.current;
  };

  return (debounced as any) as DebouncedFunc<F>;
};
