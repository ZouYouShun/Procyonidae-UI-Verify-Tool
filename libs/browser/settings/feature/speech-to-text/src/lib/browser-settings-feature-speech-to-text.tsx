import './browser-settings-feature-speech-to-text.module.scss';

import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface BrowserSettingsFeatureSpeechToTextProps {}

export function BrowserSettingsFeatureSpeechToText(
  props: BrowserSettingsFeatureSpeechToTextProps,
) {
  const { speechToText } = useContextBridge();

  const [text, setText] = useState('');

  return (
    <div>
      <button
        className="w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
        onClick={async () => {
          const result = await speechToText.selectFile();
          setText(result.text);
        }}
      >
        Choice file
      </button>
      <p>{text}</p>
    </div>
  );
}

export default BrowserSettingsFeatureSpeechToText;
