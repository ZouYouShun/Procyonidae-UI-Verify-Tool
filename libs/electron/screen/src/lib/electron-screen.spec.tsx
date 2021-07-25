import { render } from '@testing-library/react';

import ElectronScreen from './electron-screen';

describe('ElectronScreen', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ElectronScreen />);
    expect(baseElement).toBeTruthy();
  });
});
