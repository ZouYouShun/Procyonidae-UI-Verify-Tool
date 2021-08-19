import { electronSpeechToText } from './electron-speech-to-text';

describe('electronSpeechToText', () => {
  it('should work', () => {
    expect(electronSpeechToText()).toEqual('electron-speech-to-text');
  });
});
