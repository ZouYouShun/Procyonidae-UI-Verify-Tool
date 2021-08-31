export type ImageSource = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Abc = {};

export type ElectronContextBridge = {
  platform: NodeJS.Platform;
  getAppVersion: () => Promise<{
    version: string;
  }>;
  screen: {
    open: (type?: 'screenshot' | 'video') => void;
    onReady: (cd: (data: ImageSource[]) => void) => () => void;
    confirmCapture: (url: string) => void;
    onConfirmCapture: (cd: (url: string) => void) => () => void;
  };
};

export type ContextBridgeMap = {
  electron: ElectronContextBridge;
};
