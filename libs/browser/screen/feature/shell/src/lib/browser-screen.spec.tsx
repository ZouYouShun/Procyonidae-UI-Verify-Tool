import { render } from '@testing-library/react';

import BrowserScreen from './browser-screen';

describe('BrowserScreen', () => {
  xit('should render successfully', () => {
    const { baseElement } = render(<BrowserScreen />);
    expect(baseElement).toBeTruthy();
  });
});
