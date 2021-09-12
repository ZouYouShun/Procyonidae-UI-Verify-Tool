import { electronKeyboard } from './electron-keyboard';

describe('electronKeyboard', () => {
  it('should work', () => {
    expect(electronKeyboard()).toEqual('electron-keyboard');
  });
});
