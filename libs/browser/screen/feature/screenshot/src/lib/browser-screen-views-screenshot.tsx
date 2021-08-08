import './browser-screen-views-screenshot.module.scss';
import 'cropperjs/dist/cropper.css';

import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import { useEffect, useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import { useEvent } from 'react-use';

/* eslint-disable-next-line */
export interface BrowserScreenViewsScreenshotProps {}

export function BrowserScreenViewsScreenshot(
  props: BrowserScreenViewsScreenshotProps,
) {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState('');

  const { screen } = useContextBridge();

  useEvent('keydown', (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        const image = cropper.getCroppedCanvas().toDataURL();
        screen.confirmCapture(image);
        break;
      case 'Escape':
        window.close();
        break;
      default:
        break;
    }
  });

  useEvent('contextmenu', () => window.close());

  useEffect(() => {
    const destroy = screen.onReady((url) => {
      setImage(url);
    });

    return () => {
      destroy();
    };
  }, []);

  // for debug with image
  // return <img src={image} className="w-screen h-screen overflow-hidden" />;
  return (
    <Cropper
      className="w-screen h-screen overflow-hidden"
      zoomable={false}
      preview=".img-preview"
      src={image}
      viewMode={1}
      minCropBoxHeight={5}
      minCropBoxWidth={5}
      background={false}
      responsive={true}
      autoCrop={false}
      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
      ref={cropperRef}
      guides={true}
    />
  );
}

export default BrowserScreenViewsScreenshot;
