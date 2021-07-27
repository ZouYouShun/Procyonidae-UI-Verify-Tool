import './browser-screen-views-screenshot.module.scss';
import 'cropperjs/dist/cropper.css';

import { OkData } from '@procyonidae/electron/screen';
import { IpcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { Cropper } from 'react-cropper';

import { getSource } from './getSource';

let ipcRenderer: IpcRenderer;
let cropper: Cropper;

const onKeyUp = ({ code, ctrlKey, shiftKey }: KeyboardEvent) => {
  if (ctrlKey && shiftKey && code === 'Enter') {
    const canvas = cropper.getCroppedCanvas();
    const dataURL = canvas.toDataURL();
    onOk({ dataURL });
  }

  if (code === 'Escape') {
    onCancel();
  }
};

const onOk = ({ dataURL }: OkData) => {
  ipcRenderer.send('SCREENSHOTS::OK', { dataURL });
};

const onCancel = () => {
  ipcRenderer.send('SCREENSHOTS::CANCEL');
};

/* eslint-disable-next-line */
export interface BrowserScreenViewsScreenshotProps {}

export function BrowserScreenViewsScreenshot(
  props: BrowserScreenViewsScreenshotProps,
) {
  const [image, setImage] = useState('');

  useEffect(() => {
    ipcRenderer = window.require('electron').ipcRenderer;
    ipcRenderer.send('SCREENSHOTS::DOM-READY');

    window.document.body.classList.add('overflow-hidden');
    window.addEventListener('keyup', onKeyUp);

    ipcRenderer.on('SCREENSHOTS::SEND-DISPLAY-DATA', async (e, display) => {
      const { thumbnail } = await getSource(display);
      ipcRenderer.send('SCREENSHOTS::CAPTURED');
      setImage(thumbnail.toDataURL());
    });

    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <Cropper
      zoomable={false}
      initialAspectRatio={1}
      preview=".img-preview"
      src={image}
      viewMode={1}
      minCropBoxHeight={5}
      minCropBoxWidth={5}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
      onInitialized={(instance) => {
        cropper = instance;
      }}
      guides={true}
    />
  );
}

export default BrowserScreenViewsScreenshot;
