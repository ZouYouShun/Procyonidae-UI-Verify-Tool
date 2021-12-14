import { fireEvent, render } from '@testing-library/react';

import dpr from '../../../dpr';
import Screenshot from '../screenshot.component';

const EMPTY_IMAGE = {
  src: '',
  width: 0,
  height: 0,
};

const FAILURE_IMAGE = {
  src: 'LOAD_FAILURE_SRC',
  width: 0,
  height: 0,
};

const SUCCESS_IMAGE = {
  src: 'LOAD_SUCCESS_SRC',
  width: 1920,
  height: 1080,
};

function setSrc(src: string) {
  if (src === FAILURE_IMAGE.src) {
    /* @ts-ignore */
    this.dispatchEvent(new Event('error'));
  } else if (src === SUCCESS_IMAGE.src) {
    /* @ts-ignore */
    this.dispatchEvent(new Event('load'));
    /* @ts-ignore */
    this.width = SUCCESS_IMAGE.width;
    /* @ts-ignore */
    this.height = SUCCESS_IMAGE.height;
  }
}

describe.skip('ScreenshotCanvas', () => {
  beforeAll(() => {
    jest.spyOn(global.Image.prototype, 'src', 'set').mockImplementation(setSrc);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render screenshot-canvas when `image.src` is the correct image resource', () => {
    const { container } = render(
      <Screenshot
        image={SUCCESS_IMAGE.src}
        width={SUCCESS_IMAGE.width}
        height={SUCCESS_IMAGE.height}
      />,
    );

    const screenshotCanvas = container.querySelector(
      '.screenshot-canvas canvas',
    );

    jest.runAllTimers();

    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (SUCCESS_IMAGE.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (SUCCESS_IMAGE.height * dpr).toString(),
    );
  });

  it('should render screenshot-canvas when `image.src` is not the correct image resource', () => {
    const { container } = render(
      <Screenshot
        image={FAILURE_IMAGE.src}
        width={FAILURE_IMAGE.width}
        height={FAILURE_IMAGE.height}
      />,
    );

    const screenshotCanvas = container.querySelector(
      '.screenshot-canvas canvas',
    );

    jest.runAllTimers();

    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (FAILURE_IMAGE.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (FAILURE_IMAGE.height * dpr).toString(),
    );
  });

  it('should render screenshot-canvas when `image.src` is empty', () => {
    const { container } = render(
      <Screenshot
        image={EMPTY_IMAGE.src}
        width={EMPTY_IMAGE.width}
        height={EMPTY_IMAGE.height}
      />,
    );

    const screenshotCanvas = container.querySelector(
      '.screenshot-canvas canvas',
    );

    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (EMPTY_IMAGE.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (EMPTY_IMAGE.height * dpr).toString(),
    );
  });
});

describe.only('ScreenshotMagnifier', () => {
  const getBoundingClientRectSpy = jest
    .spyOn(global.Element.prototype, 'getBoundingClientRect')
    .mockImplementation(
      () =>
        ({
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          top: 0,
          right: 1920,
          bottom: 1080,
          left: 0,
        } as DOMRect),
    );

  beforeAll(() => {
    jest.spyOn(global.Image.prototype, 'src', 'set').mockImplementation(setSrc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render screenshot-magnifier', async () => {
    jest.useFakeTimers();

    const { container } = render(
      <Screenshot
        image={SUCCESS_IMAGE.src}
        width={SUCCESS_IMAGE.width}
        height={SUCCESS_IMAGE.height}
      />,
    );

    jest.advanceTimersByTime(1000);

    const screenshotCanvas = container.querySelector('.screenshot-canvas');

    fireEvent.mouseMove(document, { clientX: 0, clientY: 0 });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(1);

    for (let button of [1, 2, 3, 4]) {
      // 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
      // 2: Secondary button pressed, usually the right button
      // 3: Fourth button, typically the Browser Back button
      // 4: Fifth button, typically the Browser Forward button
      fireEvent.mouseDown(screenshotCanvas!, { button });
    }

    // 0: Main button pressed, usually the left button or the un-initialized state
    fireEvent.mouseDown(screenshotCanvas!, {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(2);

    let screenshotMagnifier = container.querySelector('.screenshot-magnifier');
    expect(screenshotMagnifier).not.toBeNull();

    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(4);
    expect(screenshotMagnifier?.getAttribute('style')).toEqual(
      'transform: translate(205px, 205px);',
    );

    fireEvent.mouseMove(document, { clientX: 400, clientY: 400 });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(6);
    expect(screenshotMagnifier?.getAttribute('style')).toBe(
      'transform: translate(405px, 405px);',
    );

    fireEvent.mouseMove(document, { clientX: 600, clientY: 600 });
    expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(8);
    expect(screenshotMagnifier?.getAttribute('style')).toBe(
      'transform: translate(605px, 605px);',
    );

    fireEvent.mouseUp(document, { clientX: 610, clientY: 610 });
    screenshotMagnifier = container.querySelector('.screenshot-magnifier');
    expect(screenshotMagnifier).toBeNull();
  });
});
