import { render } from '@testing-library/react';

import BrowserHomeComponents from './browser-home-components';

describe('BrowserHomeComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserHomeComponents />);
    expect(baseElement).toBeTruthy();
  });
});
