import { render } from '@testing-library/react';

import BrowserSnippetsUiSearchInput from './browser-snippets-ui-search-input';

describe('BrowserSnippetsUiSearchInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSnippetsUiSearchInput />);
    expect(baseElement).toBeTruthy();
  });
});
