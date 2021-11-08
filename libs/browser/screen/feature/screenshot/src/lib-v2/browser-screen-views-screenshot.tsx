import { useEffect, useState } from 'react';

import { ImageSource } from '@procyonidae/api-interfaces';
import { useContextBridge } from '@procyonidae/browser/shared/hooks';

import Screenshots from './screenshot.component';

export const BrowserScreenFeatureScreenshot = () => {
  const { screen } = useContextBridge<'electron'>();

  const [image, setImage] = useState<ImageSource>();

  useEffect(() => {
    const destroy = screen.onReady(async (originalSources) => {
      if (originalSources.length > 0) setImage(originalSources[0]);
    });

    return () => destroy();
  }, []);

  return (
    (image && (
      <Screenshots
        className={''}
        image={image.src}
        width={image.width}
        height={image.height}
      />
    )) || <></>
  );
};
