import { px } from '@ringcentral/juno';

export const zoomSize = 30;
const halfZoomSize = zoomSize / 2;
const gapRate = 20; // what % of gap

export const scaleRate = 3;
export const translateXValue = (100 + gapRate) * scaleRate;
export const translateYValue = gapRate * scaleRate;

export function setZoomViewPosition(
  zoomElm: HTMLElement,
  { left, top }: { left: number; top: number }
) {
  zoomElm.style.top = px(top);
  zoomElm.style.left = px(left);

  const imgLeft = -left + halfZoomSize;
  const imgTop = -top + halfZoomSize;

  zoomElm.style.backgroundPosition = `${px(imgLeft)} ${px(imgTop)}`;
}
