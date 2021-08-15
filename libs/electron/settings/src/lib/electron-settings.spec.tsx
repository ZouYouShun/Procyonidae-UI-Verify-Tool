import { render } from '@testing-library/react';

import ElectronSettings from './electron-settings';

describe('ElectronSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ElectronSettings />);
    expect(baseElement).toBeTruthy();
  });
});
