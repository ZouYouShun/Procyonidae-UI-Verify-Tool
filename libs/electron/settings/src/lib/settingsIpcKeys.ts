import { SettingsContextBridge, SettingsKey } from './settings-ipc-transport';

export const SettingsIpcKeys: Record<
  keyof SettingsContextBridge,
  `${SettingsKey}:${keyof SettingsContextBridge}`
> = {
  open: 'settings:open',
};
