import { createApp } from 'reactant';
import { Router } from 'reactant-router';
import { render } from 'reactant-web';

import { AppView } from './app/app.view';
import { environment } from './environments/environment.prod';

const app = createApp({
  modules: [Router],
  main: AppView,
  render,
  devOptions: environment.devOptions,
});

app.bootstrap(document.getElementById('root'));
