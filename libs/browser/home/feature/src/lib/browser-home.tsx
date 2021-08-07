import './browser-home.module.scss';

import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import { BrowserSnippetsFeature } from '@procyonidae/browser/snippets/feature';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface BrowserHomeProps {}

export function BrowserHome(props: BrowserHomeProps) {
  const contextBridge = useContextBridge();

  const handleClick = async () => {
    contextBridge.takeScreenshot();
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleClick}
      >
        Screenshot!
      </button>
      <BrowserSnippetsFeature />
    </>
  );
}

export default BrowserHome;
