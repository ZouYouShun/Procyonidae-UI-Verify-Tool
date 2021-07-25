import { render } from '@testing-library/react';

import SearchList from './search-list';

describe('SearchList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchList />);
    expect(baseElement).toBeTruthy();
  });
});
