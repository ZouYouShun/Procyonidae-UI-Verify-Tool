import './browser-settings-feature-speech-to-text.module.scss';

import { RcCircularProgress } from '@ringcentral/juno';
import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import { useState } from 'react';

import type { google } from '@google-cloud/speech/build/protos/protos';
import {
  SelectFileRes,
  SpeechToTextResponse,
} from '@procyonidae/api-interfaces';
/* eslint-disable-next-line */
export interface BrowserSettingsFeatureSpeechToTextProps {}

export function BrowserSettingsFeatureSpeechToText(
  props: BrowserSettingsFeatureSpeechToTextProps,
) {
  const { speechToText } = useContextBridge();

  const [res, setRes] = useState<SelectFileRes>();

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
          const res = await speechToText.selectFile();

          if (res) {
            setRes(res);
          }
          setLoading(false);
        }}
      >
        Choice file
      </button>
      <button
        className="w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
        onClick={() => {
          if (res) {
            speechToText.saveFile(res.source.name, res.data);
          }
        }}
      >
        Save file
      </button>
      {loading && <RcCircularProgress />}
      {res && (
        <>
          <p className="whitespace-pre-wrap">{res.source.name}</p>
          <p className="whitespace-pre-wrap">{res.text}</p>
          <pre>{JSON.stringify(res.data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default BrowserSettingsFeatureSpeechToText;
