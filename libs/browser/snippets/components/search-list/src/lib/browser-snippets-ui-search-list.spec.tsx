import { render } from '@testing-library/react';

import BrowserSnippetsUiSearchList from './browser-snippets-ui-search-list';

describe('BrowserSnippetsUiSearchList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSnippetsUiSearchList />);
    expect(baseElement).toBeTruthy();
  });
});
