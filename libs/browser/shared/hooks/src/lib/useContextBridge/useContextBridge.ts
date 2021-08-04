export const useContextBridge = () => {
  return (window as any).electron as {
    platform: NodeJS.Platform;
    getAppVersion: () => Promise<{
      version: string;
    }>;
    takeScreenshot: () => Promise<string>;
    getScreenshotImage: () => Promise<string | undefined>;
  };
};
