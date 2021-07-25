import { render } from '@testing-library/react';

import BrowserSharedAssets from './browser-shared-assets';

describe('BrowserSharedAssets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSharedAssets />);
    expect(baseElement).toBeTruthy();
  });
});
