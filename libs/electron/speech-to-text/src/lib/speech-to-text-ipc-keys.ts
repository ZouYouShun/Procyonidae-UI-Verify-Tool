import {
  SpeechToTextContextBridge,
  SpeechToTextKey,
} from './speech-to-text-ipc-transport';

export const SpeechToTextIpcKeys: Record<
  keyof SpeechToTextContextBridge,
  `${SpeechToTextKey}:${keyof SpeechToTextContextBridge}`
> = {
  selectFile: 'speechToText:selectFile',
  setServiceAccountFile: 'speechToText:setServiceAccountFile',
  saveFile: 'speechToText:saveFile',
};
