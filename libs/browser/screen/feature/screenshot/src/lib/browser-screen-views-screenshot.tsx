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

  const { getScreenshotImage } = useContextBridge();

  const onKeyUp = ({ code, ctrlKey, shiftKey }: KeyboardEvent) => {
    if (ctrlKey && shiftKey && code === 'Enter') {
      // const canvas = cropper.getCroppedCanvas();
      // const dataURL = canvas.toDataURL();
    }

    if (code === 'Escape') {
    }
  };

  useEffect(() => {
    (async () => {
      const imgUrl = await getScreenshotImage();
      if (imgUrl) {
        setImage(imgUrl);
      }
    })();

    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <Cropper
      zoomable={false}
      initialAspectRatio={1}
      preview=".img-preview"
      src={image || 'assets/image/example.jpeg'}
      viewMode={1}
      minCropBoxHeight={5}
      minCropBoxWidth={5}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
      onInitialized={(instance) => {
        cropperRef.current = instance;
      }}
      guides={true}
    />
  );
}

export default BrowserScreenViewsScreenshot;
