import './browser-home.module.scss';

import { BrowserSnippetsFeature } from '@procyonidae/browser/snippets/feature';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface BrowserHomeProps {}

export function BrowserHome(props: BrowserHomeProps) {
  const [image, setImage] = useState('');

  const handleClick = async () => {
    const { screenshots } = (window as any).electron;
    const { dataURL } = await screenshots.open();
    setImage(dataURL);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleClick}
      >
        Screenshot!
      </button>
      <img src={image} />
      <BrowserSnippetsFeature />
    </>
  );
}

export default BrowserHome;
