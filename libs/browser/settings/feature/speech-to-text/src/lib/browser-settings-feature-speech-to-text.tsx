import './browser-settings-feature-speech-to-text.module.scss';

import { CircularProgress } from '@material-ui/core';
import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import { useState } from 'react';

import type { google } from '@google-cloud/speech/build/protos/protos';
/* eslint-disable-next-line */
export interface BrowserSettingsFeatureSpeechToTextProps {}

export function BrowserSettingsFeatureSpeechToText(
  props: BrowserSettingsFeatureSpeechToTextProps,
) {
  const { speechToText } = useContextBridge();

  const [text, setText] = useState('');

  const [recognize, setRecognize] = useState<
    google.cloud.speech.v1.ISpeechRecognitionResult[]
  >([]);

  const [loading, setLoading] = useState(false);

  return (
    <div>
      <button
        className="w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
        onClick={() => {
          speechToText.setServiceAccountFile();
        }}
      >
        set service account file
      </button>
      <button
        className="w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
        onClick={async () => {
          setLoading(true);
          const { result, text } = await speechToText.selectFile();

          if (result.results) {
            setRecognize(result.results);
            setText(text);
          }
          setLoading(false);
        }}
      >
        Choice file
      </button>
      {loading && <CircularProgress />}
      <p className="whitespace-pre-wrap">{text}</p>
      <pre>{JSON.stringify(recognize, null, 2)}</pre>
      {/* {recognize.map((item) => {
        return <div>{item.alternatives.}</div>
      })} */}
    </div>
  );
}

export default BrowserSettingsFeatureSpeechToText;
