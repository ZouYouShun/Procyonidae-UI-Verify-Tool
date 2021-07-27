import { Display } from '@procyonidae/electron/screen';

export const getSource = async (display: Display) => {
  const electron = window.require('electron');
  const desktopCapturer: Electron.DesktopCapturer = electron.desktopCapturer;
  const remote: Electron.Remote = electron.remote;

  const allDisplay = remote.screen.getAllDisplays();
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: display.width,
      height: display.height,
    },
  });

  let source = sources.find(
    (source) => source.display_id === display.id.toString(),
  );

  if (!source) {
    const index = allDisplay.findIndex(({ id }) => id === display.id);
    if (index !== -1) {
      source = sources[index];
    }
  }

  return source as Electron.DesktopCapturerSource;
};
