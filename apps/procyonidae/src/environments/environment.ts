import { DevOptions } from 'reactant';

// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment: { production: boolean; devOptions?: DevOptions } = {
  production: false,
  devOptions: {
    reduxDevTools: true,
  },
};
