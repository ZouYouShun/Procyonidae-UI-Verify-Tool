import { SnippetContextBridge, SnippetKey } from './snippet-ipc-transport';

export const SnippetIpcKeys: Record<
  keyof SnippetContextBridge,
  `${SnippetKey}:${keyof SnippetContextBridge}`
> = {
  confirm: 'snippet:confirm',
  setHeight: 'snippet:setHeight',
};
