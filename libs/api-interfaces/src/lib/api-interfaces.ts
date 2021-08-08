export type ElectronContextBridge = {
  platform: NodeJS.Platform;
  getAppVersion: () => Promise<{
    version: string;
  }>;
  screen: {
    open: (type?: 'screenshot' | 'video') => void;
    onReady: (cd: (url: string) => void) => () => void;
    confirmCapture: (url: string) => void;
    onConfirmCapture: (cd: (url: string) => void) => () => void;
  };
};

export type ContextBridgeMap = {
  electron: ElectronContextBridge;
};
