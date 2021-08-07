import { ContextBridgeMap } from '@procyonidae/api-interfaces';

export const useContextBridge = <T extends keyof ContextBridgeMap = 'electron'>(
  key = 'electron' as T,
) => {
  return (window as any)[key] as ContextBridgeMap[T];
};
