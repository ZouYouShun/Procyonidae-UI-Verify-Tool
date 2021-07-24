import { render } from '@testing-library/react';

import Rainbowfish from './rainbowfish';

describe('Rainbowfish', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Rainbowfish />);
    expect(baseElement).toBeTruthy();
  });
});
