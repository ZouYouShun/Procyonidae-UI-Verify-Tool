import { IpcRenderer } from 'electron';
import React from 'react';

import { IpcContext } from './ipc-context';

/* eslint-disable-next-line */
export interface IpcProviderProps {
  ipcRenderer: IpcRenderer;
}

export const IpcProvider: React.FC<IpcProviderProps> = ({
  ipcRenderer,
  children,
}) => {
  return (
    <IpcContext.Provider value={ipcRenderer}>{children}</IpcContext.Provider>
  );
};

export default IpcProvider;
