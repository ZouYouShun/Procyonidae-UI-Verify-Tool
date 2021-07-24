import { render } from '@testing-library/react';

import SettingHeader from './setting-header';

describe('SettingHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SettingHeader />);
    expect(baseElement).toBeTruthy();
  });
});
