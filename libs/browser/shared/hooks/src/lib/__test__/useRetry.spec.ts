import {
  act,
  renderHook,
  RenderHookResult,
} from '@testing-library/react-hooks';
import { useRetry, UseRetryOptions } from './../useRetry/useRetry';

describe('useRetry', () => {
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
    expect(useRetry).toBeDefined();
  });

  function getHook(
    options?: UseRetryOptions,
  ): [
    jest.Mock,
    RenderHookResult<{ delay: number }, ReturnType<typeof useRetry>>,
  ] {
    const spy = jest.fn();

    return [spy, renderHook(() => useRetry(spy, options))];
  }

  async function wait(ms: number) {
    await Promise.resolve();
    return jest.advanceTimersByTime(ms);
  }

  it('should be successful on the first attempt when retry is called', async () => {
    const onCompleteSpy = jest.fn();
    const onStartSpy = jest.fn();
    const onSuccessSpy = jest.fn();

    const [spy, hook] = getHook({
      retryTimes: 3,
      intervalTime: 5,
      onComplete: onCompleteSpy,
      onStart: onStartSpy,
      onSuccess: onSuccessSpy,
    });

    const { retry } = hook.result.current;

    spy.mockImplementation(() => Promise.resolve(true));

    act(() => {
      retry();
    });

    expect(spy).toHaveBeenCalled();
    expect(onStartSpy).toHaveBeenCalled();

    await wait(0);
    expect(onSuccessSpy).toHaveBeenCalled();
    expect(onCompleteSpy).toHaveBeenCalled();
  });

  it('should be successful on the second attempt when retry is called', async () => {
    const onCompleteSpy = jest.fn();
    const onStartSpy = jest.fn();
    const onSuccessSpy = jest.fn();

    const [spy, hook] = getHook({
      retryTimes: 3,
      intervalTime: 5,
      onComplete: onCompleteSpy,
      onStart: onStartSpy,
      onSuccess: onSuccessSpy,
    });

    const { retry } = hook.result.current;

    spy.mockImplementation(() => Promise.resolve(false));

    act(() => {
      retry();
    });

    expect(spy).toHaveBeenCalled();
    expect(onStartSpy).toHaveBeenCalled();

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockImplementation(() => Promise.resolve(true));

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(3);

    await wait(0);
    expect(onSuccessSpy).toHaveBeenCalled();
    expect(onCompleteSpy).toHaveBeenCalled();
  });

  it('should have failed on all attempts when retry is called', async () => {
    const onCompleteSpy = jest.fn();
    const [spy, hook] = getHook({
      retryTimes: 3,
      intervalTime: 5,
      onComplete: onCompleteSpy,
    });

    const { retry } = hook.result.current;

    spy.mockImplementation(() => Promise.resolve(false));

    act(() => {
      retry();
    });

    expect(spy).toHaveBeenCalled();

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(2);

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(3);

    await wait(5);
    expect(spy).toHaveBeenCalledTimes(4);

    await wait(0);
    expect(onCompleteSpy).toHaveBeenCalled();
  });

  it('should complete retry when retry is called and then cancel is called', async () => {
    const onCancelSpy = jest.fn();
    const onCompleteSpy = jest.fn();

    const [spy, hook] = getHook({
      retryTimes: 3,
      intervalTime: 5,
      onCancel: onCancelSpy,
      onComplete: onCompleteSpy,
    });

    const { retry, cancel } = hook.result.current;

    spy.mockImplementation(() => Promise.resolve(false));

    act(() => {
      retry();
      cancel();
    });

    expect(onCancelSpy).toHaveBeenCalled();
    expect(onCompleteSpy).toHaveBeenCalled();
  });

  it('should complete retry when the options parameter is empty', async () => {
    const [spy, hook] = getHook();

    const { retry } = hook.result.current;

    spy.mockImplementation(() => Promise.resolve(false));

    act(() => {
      retry();
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should be no action when retry is called', async () => {
    const onCancelSpy = jest.fn();
    const onCompleteSpy = jest.fn();

    const [spy, hook] = getHook({
      intervalTime: 5,
      retryTimes: 3,
      onCancel: onCancelSpy,
      onComplete: onCompleteSpy,
    });

    const { cancel } = hook.result.current;

    act(() => {
      cancel();
    });

    await wait(5);
    expect(spy).not.toHaveBeenCalled();
  });
});
