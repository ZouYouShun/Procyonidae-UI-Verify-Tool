import { fluentFfmpeg } from './ffmpeg';

describe('fluentFfmpeg', () => {
  it('should work', () => {
    expect(fluentFfmpeg()).toEqual('ffmpeg');
  });
});
