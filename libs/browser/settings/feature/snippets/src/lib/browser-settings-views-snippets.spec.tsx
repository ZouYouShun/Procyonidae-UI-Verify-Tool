import { render } from '@testing-library/react';

import BrowserSettingsViewsSnippets from './browser-settings-views-snippets';

describe('BrowserSettingsViewsSnippets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSettingsViewsSnippets />);
    expect(baseElement).toBeTruthy();
  });
});
