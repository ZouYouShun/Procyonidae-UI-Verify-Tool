import { useEffect, useRef } from 'react';

import { useIpc } from './ipc-context';

export const useIpcListener = <T extends (...args: any[]) => any>(
  key: string,
  cb: T,
) => {
  const ipc = useIpc();
  const cbRef = useRef((...args: any) => cb(...args));

  useEffect(() => {
    const method = cbRef.current;

    ipc.on(key, method);

    return () => {
      ipc.removeListener(key, method);
    };
  }, []);
};
