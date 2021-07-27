import { render } from '@testing-library/react';

import BrowserScreenViewsRecorder from './browser-screen-views-recorder';

describe('BrowserScreenViewsRecorder', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserScreenViewsRecorder />);
    expect(baseElement).toBeTruthy();
  });
});
