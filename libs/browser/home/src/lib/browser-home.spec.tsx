import { render } from '@testing-library/react';

import BrowserHome from './browser-home';

describe('BrowserHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserHome />);
    expect(baseElement).toBeTruthy();
  });
});
