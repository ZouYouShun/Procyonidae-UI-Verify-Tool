import { action, injectable, state, useConnector, ViewModule } from 'reactant';
import { Route, Switch } from 'reactant-web';

import Home from './pages/home/home';
import Settings from './pages/settings/settings';

@injectable()
class Counter {
  @state
  count = 0;

  @action
  increase() {
    this.count += 1;
  }

  @action
  decrease() {
    this.count -= 1;
  }
}

@injectable()
export class AppView extends ViewModule {
  constructor(private counter: Counter) {
    super();
  }

  component() {
    const count = useConnector(() => this.counter.count);

    return (
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Switch>
    );
  }
}
