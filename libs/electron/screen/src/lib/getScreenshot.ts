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

export const getCurrentCursorDisplay = () => {
  const { x, y } = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });

  return currentDisplay;
};

export const getDisplayDetail = (display: Electron.Display) => {
  // win32 darwin linux platforms are handled separately
  const { x, y, width, height } =
    process.platform === 'linux' ? display.workArea : display.bounds;

  // The mac image is too large, causing the screenshot window to lag, and the screenshot window display delay is very serious
  const scale = process.platform === 'darwin' ? 1 : display.scaleFactor;

  return {
    id: display.id,
    rectangle: {
      x: x * scale,
      y: y * scale,
      width: width * scale,
      height: height * scale,
    },
  };
};

export type DisplayScreenDetail = {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getAllDisplayScreenshots = () => {
  const displays = screen.getAllDisplays().map(getDisplayDetail);

  return Promise.all(
    displays.map(async ({ id, rectangle }) => {
      const img = await getImageFromRectangle(id.toString(), rectangle);
      return {
        id,
        ...rectangle,
        src: img.thumbnail.toDataURL(),
      } as DisplayScreenDetail;
    }),
  );
};
