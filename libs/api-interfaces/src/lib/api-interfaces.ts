import type { google } from '@google-cloud/speech/build/protos/protos';

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
    onReady: (cd: (url: string) => void) => () => void;
    confirmCapture: (url: string) => void;
    onConfirmCapture: (cd: (url: string) => void) => () => void;
  };
  snippet: {
    confirm: (text: string) => Promise<boolean>;
    setHeight: (height: number) => void;
  };
  speechToText: {
    setServiceAccountFile: () => void;
    selectFile: () => Promise<{
      result: google.cloud.speech.v1.IRecognizeResponse;
      text: string;
    }>;
  };
};

export type ContextBridgeMap = {
  electron: ElectronContextBridge;
};
