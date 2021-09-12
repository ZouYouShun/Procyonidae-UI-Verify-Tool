import type { ParsedPath } from 'path';
import { SpeechToTextResponse } from './speech-to-text.interface';

export type ImageSource = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SelectFileRes = {
  source: ParsedPath;
  text: string;
  data: SpeechToTextResponse[];
};

export type ElectronContextBridge = {
  platform: NodeJS.Platform;
  getAppVersion: () => Promise<{
    version: string;
  }>;
  /** close window */
  hide: () => void;
  settings: {
    open: () => void;
  };
  screen: {
    open: (type?: 'screenshot' | 'video') => void;
    onReady: (cd: (data: ImageSource[]) => void) => () => void;
    confirmCapture: (url: string) => void;
    onConfirmCapture: (cd: (url: string) => void) => () => void;
  };
  snippet: {
    confirm: (text: string) => Promise<boolean>;
    setHeight: (height: number) => void;
  };
  speechToText: {
    setServiceAccountFile: () => void;
    selectFile: () => Promise<SelectFileRes>;
    saveFile: (
      filename: string,
      data: SpeechToTextResponse[],
    ) => Promise<string>;
  };
};

export type ContextBridgeMap = {
  electron: ElectronContextBridge;
};
