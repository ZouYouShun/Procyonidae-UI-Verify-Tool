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
    selectFile: () => Promise<{
      text: string;
    }>;
  };
};

export type ContextBridgeMap = {
  electron: ElectronContextBridge;
};
