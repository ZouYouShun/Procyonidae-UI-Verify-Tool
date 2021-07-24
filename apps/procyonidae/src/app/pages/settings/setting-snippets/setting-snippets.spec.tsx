import { render } from '@testing-library/react';

import SettingSnippets from './setting-snippets';

describe('SettingSnippets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SettingSnippets />);
    expect(baseElement).toBeTruthy();
  });
});
