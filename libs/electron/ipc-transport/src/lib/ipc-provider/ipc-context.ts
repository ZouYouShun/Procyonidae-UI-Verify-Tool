import { ipcRenderer } from 'electron';
import { createContext, useContext } from 'react';

type IpcContextValue = typeof ipcRenderer;

export const IpcContext = createContext<IpcContextValue>(null as any);

export const useIpc = () => useContext(IpcContext);
