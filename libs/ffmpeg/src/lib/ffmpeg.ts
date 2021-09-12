import { execSync } from 'child_process';
import pathToFfmpeg from 'ffmpeg-static';

//Get the paths to the packaged versions of the binaries we want to use
export const ffmpegPath = pathToFfmpeg.replace('app.asar', 'app.asar.unpacked');

export const ffmpegSync = (cmd: string[] | string) => {
  const commands = typeof cmd === 'string' ? [cmd] : cmd;

  return execSync([ffmpegPath, ...commands].join(' '))
    .toString()
    .trim();
};
