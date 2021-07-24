import { render } from '@testing-library/react';

import SettingAccount from './setting-account';

describe('SettingAccount', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SettingAccount />);
    expect(baseElement).toBeTruthy();
  });
});
