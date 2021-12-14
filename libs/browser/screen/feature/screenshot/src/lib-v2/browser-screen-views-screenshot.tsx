import { useEffect, useState } from 'react';

import { ImageSource } from '@procyonidae/api-interfaces';

import Screenshot from './screenshot.component';

export const BrowserScreenFeatureScreenshot = () => {
  // const { screen } = useContextBridge<'electron'>();

  const [image, setImage] = useState<ImageSource>();

  useEffect(() => {
    // const destroy = screen.onReady(async (originalSources) => {
    //   if (originalSources.length > 0) setImage(originalSources[0]);
    // });

    setImage({
      src: 'http://localhost:4200/assets/image/wallpaper-001.jpg',
      width: 1920,
      height: 1080,
    } as ImageSource);

    document.body.style.overflow = 'hidden';

    // return () => destroy();
  }, []);

  return (
    (image && (
      <Screenshot
        className={''}
        image={image.src}
        width={image.width}
        height={image.height}
      />
    )) || <></>
  );
};
