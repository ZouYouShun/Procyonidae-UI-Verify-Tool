import { screen } from 'electron';
import { BoundAndDisplay } from './typings';

export default (): BoundAndDisplay => {
  const point = screen.getCursorScreenPoint();
  const { id, bounds, workArea, scaleFactor } =
    screen.getDisplayNearestPoint(point);

  // win32 darwin linux platforms are handled separately
  const display = process.platform === 'linux' ? workArea : bounds;
  // The mac image is too large, causing the screenshot window to lag, and the screenshot window display delay is very serious
  const scale = process.platform === 'darwin' ? 1 : scaleFactor;

  return {
    bound: {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    },
    display: {
      id,
      x: display.x * scale,
      y: display.y * scale,
      width: display.width * scale,
      height: display.height * scale,
    },
  };
};
