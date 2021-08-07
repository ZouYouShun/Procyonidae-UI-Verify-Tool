export type IElectronContextBridge = {
  platform: NodeJS.Platform;
  getAppVersion: () => Promise<{
    version: string;
  }>;
  takeScreenshot: () => void;
  getScreenshotImage: () => Promise<string | undefined>;
  onOpenScreenshot: (cd: (url: string) => void) => () => void;
};

export type ContextBridgeMap = {
  electron: IElectronContextBridge;
};
