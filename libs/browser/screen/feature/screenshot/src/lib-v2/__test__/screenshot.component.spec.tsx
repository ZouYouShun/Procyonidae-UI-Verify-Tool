import { ImageSource } from '@procyonidae/api-interfaces';
import { cleanup, render } from '@testing-library/react';

import dpr from '../../../dpr';
import Screenshot from '../screenshot.component';

const LOAD_FAILURE_SRC = 'LOAD_FAILURE_SRC';
const LOAD_SUCCESS_SRC = 'LOAD_SUCCESS_SRC';

jest.useFakeTimers();

describe.only('screenshot', () => {
  beforeAll(() => {
    Object.defineProperty(global.Image.prototype, 'src', {
      set(src) {
        if (src === LOAD_FAILURE_SRC) {
          setTimeout(() => this.dispatchEvent(new Event('error')), 100);
        } else if (src === LOAD_SUCCESS_SRC) {
          setTimeout(() => this.dispatchEvent(new Event('load')), 100);
        }
      },
    });
  });

  afterEach(cleanup);

  it('should render screenshot-canvas when `image.src` is the correct image resource', () => {
    const image = {
      src: LOAD_SUCCESS_SRC,
      width: 1920,
      height: 1080,
    } as ImageSource;

    const { container } = render(
      <Screenshot
        image={image.src}
        width={image.width}
        height={image.height}
      />,
    );

    const screenshotCanvas = container.querySelector(
      '.screenshot-canvas canvas',
    );

    jest.runAllTimers();

    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (image.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (image.height * dpr).toString(),
    );
  });

  it('should render screenshot-canvas when `image.src` is not the correct image resource', () => {
    const image = {
      src: LOAD_FAILURE_SRC,
      width: 0,
      height: 0,
    } as ImageSource;

    const { container } = render(
      <Screenshot
        image={image.src}
        width={image.width}
        height={image.height}
      />,
    );

    const screenshotCanvas = container.querySelector(
      '.screenshot-canvas canvas',
    );

    jest.runAllTimers();

    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (image.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (image.height * dpr).toString(),
    );
  });

  it('should render screenshot-canvas when `image.src` is empty', async () => {
    const image = {
      src: undefined as unknown as string,
      width: 0,
      height: 0,
    } as ImageSource;

    const { container } = render(
      <Screenshot
        image={image.src}
        width={image.width}
        height={image.height}
      />,
    );

    const screenshotCanvas = container.querySelector(
      '.screenshot-canvas canvas',
    );

    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (image.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (image.height * dpr).toString(),
    );
  });
});
