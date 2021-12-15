import { waitForRenderReady } from './../../../../../../test/src/lib/wait-for-render-ready';
import { EachRun } from '@procyonidae/test';
import {
  act,
  renderHook,
  RenderHookResult,
  RenderResult,
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
    jest.advanceTimersByTime(ms);
    await Promise.resolve();
  }

  it.each`
    retryTimes | successIndex | intervalTime
    ${3}       | ${0}         | ${5}
    ${4}       | ${1}         | ${10}
    ${5}       | ${2}         | ${15}
  `(
    'Should be successful on the $successIndex attempt when retry is called in $intervalTime ms',
    async (...args) => {
      const conditionCallBackSpy = jest.fn();
      const onCompleteSpy = jest.fn();
      const onStartSpy = jest.fn();
      const onSuccessSpy = jest.fn();

      const callArgs = ['cool', 'cool2', 'cool3'];

      await EachRun<
        { retryTimes: number; successIndex: number; intervalTime: number },
        {
          result: RenderResult<ReturnType<typeof useRetry>>;
        }
      >`
        Scenario: Should be successful on the $successIndex attempt when retry is called in $intervalTime ms
        Given: Init a retry hook ${(
          { retryTimes, successIndex, intervalTime },
          context,
        ) => {
          const { result } = renderHook(() =>
            useRetry(conditionCallBackSpy, {
              retryTimes,
              intervalTime,
              onComplete: onCompleteSpy,
              onStart: onStartSpy,
              onSuccess: onSuccessSpy,
            }),
          );

          context.result = result;
        }}
        Then: init callback should not be called ${() => {
          expect(conditionCallBackSpy).not.toBeCalled();
        }}
        When: user call retry method ${({ successIndex }, context) => {
          conditionCallBackSpy.mockImplementation((...args: any[]) => {
            if (successIndex === 0) {
              return true;
            }

            if (args.pop() === successIndex - 1) {
              return true;
            }

            return false;
          });

          context.result.current.retry(...callArgs);
        }}
        Then: onStart to be called ${() => {
          expect(onStartSpy).toBeCalled();
        }}
        Then: condition callback should be called immediately
        And: condition callback should be called with correct arguments ${() => {
          expect(conditionCallBackSpy).toBeCalled();
          expect(conditionCallBackSpy).toBeCalledWith(...callArgs);
        }}
        When: after [$successIndex + 1 * $intervalTime] ms ${async ({
          intervalTime,
          successIndex,
        }) => {
          let i = successIndex;
          while (i > 0) {
            jest.advanceTimersByTime(intervalTime * successIndex + 1);
            await waitForRenderReady();
            i--;
          }
        }}
        Then: condition callback should be called $successIndex times ${({
          successIndex,
        }) => {
          expect(conditionCallBackSpy).toBeCalledTimes(successIndex + 1);
        }}
        And: onSuccess to be called ${() => {
          expect(onSuccessSpy).toBeCalled();
        }}
        And: onComplete to be called ${() => {
          expect(onCompleteSpy).toBeCalled();
        }}
        `(...args);
    },
  );

  it.each`
    parameters            | successIndex | intervalTime | result
    ${['a1']}             | ${0}         | ${5}         | ${['a1']}
    ${['a1', 'a2']}       | ${1}         | ${10}        | ${['a1', 'a2', 0]}
    ${['a1', 'a2']}       | ${2}         | ${10}        | ${['a1', 'a2', 1]}
    ${['a1', 'a2', 'a3']} | ${2}         | ${15}        | ${['a1', 'a2', 'a3', 1]}
    ${['a1', 'a2', 'a3']} | ${3}         | ${15}        | ${['a1', 'a2', 'a3', 2]}
  `('Condition callback args', async (...args) => {
    await EachRun`
        Scenario: Condition callback args should be correct
        Given: Init a retry hook
        When: user call retry method
        Then: condition callback should be called with correct arguments ${({}) => {}}
        When: after [$successIndex + 1 * $intervalTime] ms
        Then: the final arguments will be $result ${({}) => {}}
      `(...args);
  });

  it.each`
    retryTimes | intervalTime
    ${3}       | ${5}
    ${4}       | ${10}
    ${5}       | ${10}
    ${6}       | ${15}
    ${7}       | ${15}
  `(
    'condition callback should be call immediately and be call with $retryTimes + 1 times',
    async (...args) => {
      await EachRun`
        Scenario: condition callback should be call immediately and be call with $retryTimes + 1 times
        Given: Init a retry hook
        When: user call retry method
        Then: condition callback should be called immediately
        When: after [$intervalTime * $retryTimes] ms
        Then: condition callback be call retryTimes + 1 times
      `(...args);
    },
  );

  it.each`
    retryTimes | parameters            | intervalTime | result
    ${3}       | ${['a1']}             | ${5}         | ${['a1']}
    ${4}       | ${['a1', 'a2']}       | ${10}        | ${['a1', 'a2', 0]}
    ${5}       | ${['a1', 'a2']}       | ${10}        | ${['a1', 'a2', 1]}
    ${6}       | ${['a1', 'a2', 'a3']} | ${15}        | ${['a1', 'a2', 'a3', 1]}
    ${7}       | ${['a1', 'a2', 'a3']} | ${15}        | ${['a1', 'a2', 'a3', 2]}
  `(
    'Call retry again with $retryTimes, that onCancel should be call and that retry index will to be re-calculate',
    async (...args) => {
      await EachRun`
        Scenario: Call retry again, that onCancel should be call and that retry index will to be re-calculate
        Given: Init a retry hook
        When: user call retry method
        Then: condition callback should be called immediately
        Then: after [$intervalTime * $retryTimes - 1] ms
        Then: condition callback be call retryTimes (with first call) times
        And: condition callback final be called with parameters follow with retryTimes times
        When: user call retry method
        Then: condition callback should be called immediately
        When: after $intervalTime ms
        Then: the condition callback will be call again with parameters follow with 0
      `(...args);
    },
  );

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
