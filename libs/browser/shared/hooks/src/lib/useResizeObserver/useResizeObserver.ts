import { useEventCallback } from '@ringcentral/juno';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { useLayoutEffect, useRef } from 'react';

import { useResultRef } from '../useResultRef';

export type PerformanceOptions = {
  /**
   * mode that improve performance, default is debounce
   *
   * throttle is better than debounce when use for responsive UI
   */
  mode?: 'debounce' | 'throttle' | 'none';
  /** debounce time or throttle time when resize, default is 200 */
  time?: number;
  /** ignore fire when observe */
  ignoreFireWhenObserve?: boolean;
};

/**
 * get resize event with auto disconnect when layout destroy.
 * bring with debounce for event not too many
 * @param ref that ref for element
 * @param callback callback when element resize
 * @param performance options that improve performance
 */
export const useResizeObserver = (
  /** target element ref */
  ref: React.RefObject<HTMLElement>,
  /** trigger when `ResizeObserver` emit */
  callback: ResizeObserverCallback,
  /** performance options, `mode`, `time`, `ignoreFireWhenObserve` */
  performance: PerformanceOptions = {},
) => {
  const {
    mode = 'debounce',
    time: performanceTime = 200,
    ignoreFireWhenObserve,
  } = performance;

  const countRef = useRef(0);

  const cb = useEventCallback((...args: any[]) => {
    if (ignoreFireWhenObserve) {
      if (countRef.current === 0) {
        countRef.current = 1;
        return;
      }
    }

    return (callback as any)(...args);
  });

  const observerRef = useResultRef(() => {
    let resizeCallback: ResizeObserverCallback;
    if (mode === 'debounce') {
      resizeCallback = debounce(cb, performanceTime);
    } else if (mode === 'throttle') {
      resizeCallback = throttle(cb, performanceTime);
    } else {
      resizeCallback = cb;
    }

    return new ResizeObserver(resizeCallback);
  });

  useLayoutEffect(() => {
    const observer = observerRef.current!;
    const elm = ref.current;

    if (!elm) {
      throw new Error('please check element exist before bind resize observer');
    }

    observer.observe(elm);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return observerRef.current;
};
