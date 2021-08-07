import { render } from '@testing-library/react';

import BrowserScreenViewsScreenshot from './browser-screen-views-screenshot';

xdescribe('BrowserScreenViewsScreenshot', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserScreenViewsScreenshot />);
    expect(baseElement).toBeTruthy();
  });
});
