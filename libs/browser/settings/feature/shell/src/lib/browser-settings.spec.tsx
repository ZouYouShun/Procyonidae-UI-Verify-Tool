import { render } from '@testing-library/react';

import BrowserSettings from './browser-settings';

describe('BrowserSettings', () => {
  xit('should render successfully', () => {
    const { baseElement } = render(<BrowserSettings />);
    expect(baseElement).toBeTruthy();
  });
});
