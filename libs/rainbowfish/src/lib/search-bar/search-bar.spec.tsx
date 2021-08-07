import { render } from '@testing-library/react';

import SearchBar from './search-bar';

xdescribe('SearchBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchBar />);
    expect(baseElement).toBeTruthy();
  });
});
