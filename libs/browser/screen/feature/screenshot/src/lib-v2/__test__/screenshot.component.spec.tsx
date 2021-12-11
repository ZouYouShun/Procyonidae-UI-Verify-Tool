import fs from 'fs';

import { ImageSource } from '@procyonidae/api-interfaces';
import { cleanup, render } from '@testing-library/react';

import dpr from '../../../dpr';
import Screenshot from '../screenshot.component';

const mockImageFile =
  'libs/browser/shared/assets/src/assets/image/wallpaper-001.jpg';

fdescribe('screenshot', () => {
  afterEach(cleanup);

  it('should render screenshot-canvas when `image.src` is the correct image resource', () => {
    const image = {
      src: `data:image/png;base64,${fs
        .readFileSync(mockImageFile)
        .toString('base64')}`,
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
    expect(screenshotCanvas).toBeDefined();
    expect(screenshotCanvas?.getAttribute('width')).toBe(
      (image.width * dpr).toString(),
    );
    expect(screenshotCanvas?.getAttribute('height')).toBe(
      (image.height * dpr).toString(),
    );
  });
});
