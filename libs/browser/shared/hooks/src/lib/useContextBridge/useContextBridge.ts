import { getIpcBridge } from '@procyonidae/electron/ipc-transport';

export const useContextBridge = () => {
  return (window as any).electron as ReturnType<typeof getIpcBridge>;
};
