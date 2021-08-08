import { ScreenContextBridge, ScreenKey } from './screen-ipc-transport';


export const screenIpcKeys: Record<
  keyof ScreenContextBridge, `${ScreenKey}:${keyof ScreenContextBridge}`
> = {
  open: 'screen:open',
  onReady: 'screen:onReady',
  confirmCapture: 'screen:confirmCapture',
  onConfirmCapture: 'screen:onConfirmCapture',
};
