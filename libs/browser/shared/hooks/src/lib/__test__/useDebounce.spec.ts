import {
  act,
  renderHook,
  RenderHookResult,
} from '@testing-library/react-hooks';

import { DebouncedFunc, useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(useDebounce).toBeDefined();
  });

  function getHook(
    ms: number = 5,
  ): [jest.Mock, RenderHookResult<{ delay: number }, DebouncedFunc<any>>] {
    const spy = jest.fn();
    return [
      spy,
      renderHook(({ delay }) => useDebounce(spy, delay), {
        initialProps: { delay: ms },
      }),
    ];
  }

  async function wait(ms: number) {
    await Promise.resolve();
    jest.advanceTimersByTime(ms);
  }

  it('should call passed function after given amount of time', async () => {
    const [spy, hook] = getHook();

    hook.result.current();
    expect(spy).not.toBeCalled();

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should cancel function call on unmount', async () => {
    const [spy, hook] = getHook();

    hook.result.current();
    expect(spy).not.toHaveBeenCalled();

    hook.unmount();

    await wait(5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('second function should cancel debounce', async () => {
    const [spy, hook] = getHook();
    const { cancel } = hook.result.current;

    hook.result.current();
    expect(spy).not.toHaveBeenCalled();

    act(() => {
      cancel();
    });

    await wait(5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('second function should flush debounce', async () => {
    const [spy, hook] = getHook();
    const { flush } = hook.result.current;

    hook.result.current(1, 2);
    expect(spy).not.toHaveBeenCalled();

    act(() => {
      spy.mockImplementation((a, b) => a + b);
      expect(flush()).toEqual(3);
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should reset timeout on delay change', async () => {
    const [spy, hook] = getHook(50);

    hook.result.current();
    expect(spy).not.toHaveBeenCalled();

    hook.rerender({ delay: 5 });
    hook.result.current();

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(1);

    await wait(50);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
