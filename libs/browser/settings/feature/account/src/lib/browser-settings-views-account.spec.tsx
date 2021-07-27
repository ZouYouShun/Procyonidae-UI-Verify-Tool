import { render } from '@testing-library/react';

import BrowserSettingsViewsAccount from './browser-settings-views-account';

describe('BrowserSettingsViewsAccount', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSettingsViewsAccount />);
    expect(baseElement).toBeTruthy();
  });
});
