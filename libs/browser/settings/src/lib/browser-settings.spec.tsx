import { render } from '@testing-library/react';

import BrowserSettings from './browser-settings';

describe('BrowserSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSettings />);
    expect(baseElement).toBeTruthy();
  });
});
