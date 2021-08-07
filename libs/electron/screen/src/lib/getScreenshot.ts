import { desktopCapturer, remote, screen } from 'electron';

const getImageFromRectangle = async (
  /** window id */
  id: string,
  rectangle: Electron.Rectangle,
) => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: rectangle.width,
      height: rectangle.height,
    },
  });

  let source = sources.find((source) => source.display_id === id);

  if (!source) {
    const allDisplay = remote.screen.getAllDisplays();

    const index = allDisplay.findIndex(
      (display) => display.id.toString() === id,
    );

    if (index !== -1) {
      source = sources[index];
    }
  }

  return source as Electron.DesktopCapturerSource;
};

export const getScreenshot = () => {
  const point = screen.getCursorScreenPoint();

  const display = screen.getDisplayNearestPoint(point);

  // TODO: show all screen and cover with a big window, and put image in correct position
  // const allDisplay = screen.getAllDisplays();

  // win32 darwin linux platforms are handled separately
  const displayArea =
    display[process.platform === 'linux' ? 'workArea' : 'bounds'];

  // The mac image is too large, causing the screenshot window to lag, and the screenshot window display delay is very serious
  const scale = process.platform === 'darwin' ? 1 : display.scaleFactor;

  const rectangle: Electron.Rectangle = {
    x: displayArea.x * scale,
    y: displayArea.y * scale,
    width: displayArea.width * scale,
    height: displayArea.height * scale,
  };

  const captureSource = getImageFromRectangle(display.id.toString(), rectangle);

  return {
    ...display,
    /** that rect of that should display image */
    captureSource,
  };
};
