import { render } from '@testing-library/react';

import BrowserSharedUtils from './browser-shared-utils';

describe('BrowserSharedUtils', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSharedUtils />);
    expect(baseElement).toBeTruthy();
  });
});
