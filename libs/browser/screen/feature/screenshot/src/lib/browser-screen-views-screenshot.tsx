import './browser-screen-views-screenshot.module.scss';
import 'cropperjs/dist/cropper.css';

import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import { useEffect, useRef, useState } from 'react';
import { Cropper } from 'react-cropper';

/* eslint-disable-next-line */
export interface BrowserScreenViewsScreenshotProps {}

export function BrowserScreenViewsScreenshot(
  props: BrowserScreenViewsScreenshotProps,
) {
  const cropperRef = useRef<Cropper>();
  const [image, setImage] = useState('');

  const { onOpenScreenshot, getScreenshotImage } = useContextBridge();

  const onKeyUp = ({ code, ctrlKey, shiftKey }: KeyboardEvent) => {
    if (ctrlKey && shiftKey && code === 'Enter') {
      // const canvas = cropper.getCroppedCanvas();
      // const dataURL = canvas.toDataURL();
    }

    if (code === 'Escape') {
    }
  };

  useEffect(() => {
    const destroy = onOpenScreenshot((url) => {
      console.log(url);
      setImage(url);
    });

    return () => {
      destroy();
      window.removeEventListener('keyup', onKeyUp);
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
      onInitialized={(instance) => {
        cropperRef.current = instance;
      }}
      guides={true}
    />
  );
}

export default BrowserScreenViewsScreenshot;
