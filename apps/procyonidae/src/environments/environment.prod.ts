import { DevOptions } from 'reactant';

export const environment: { production: boolean; devOptions?: DevOptions } = {
  production: true,
  devOptions: {
    reduxDevTools: false,
  },
};
