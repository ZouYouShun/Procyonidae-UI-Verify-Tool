import { render } from '@testing-library/react';

import BrowserHomeServices from './browser-home-services';

describe('BrowserHomeServices', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserHomeServices />);
    expect(baseElement).toBeTruthy();
  });
});
