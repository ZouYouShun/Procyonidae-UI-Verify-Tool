import { render } from '@testing-library/react';

import BrowserSharedServices from './browser-shared-services';

describe('BrowserSharedServices', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSharedServices />);
    expect(baseElement).toBeTruthy();
  });
});
