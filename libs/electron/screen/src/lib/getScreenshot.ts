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
  // TODO: show all screen and cover with a big window, and put image in correct position
  const allDisplay = screen.getAllDisplays();

  const displaySources = allDisplay.map((display) => {
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
  });

  const displaySourceMap = new Map(
    displaySources.map((source) => [source.id.toString(), source]),
  );

  const captureSources = (async () => {
    const imageSources = await Promise.all(
      displaySources.map(({ id, rectangle }) =>
        getImageFromRectangle(id.toString(), rectangle),
      ),
    );

    return imageSources.map((img) => ({
      ...(displaySourceMap.get(img.display_id)?.rectangle || {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }),
      src: img.thumbnail.toDataURL(),
    }));
  })();

  return {
    /** that rect of that should display image */
    captureSources,
  };
};
