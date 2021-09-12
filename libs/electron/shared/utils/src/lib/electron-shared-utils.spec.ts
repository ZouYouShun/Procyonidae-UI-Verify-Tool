import { electronSharedUtils } from './electron-shared-utils';

describe('electronSharedUtils', () => {
  it('should work', () => {
    expect(electronSharedUtils()).toEqual('electron-shared-utils');
  });
});
