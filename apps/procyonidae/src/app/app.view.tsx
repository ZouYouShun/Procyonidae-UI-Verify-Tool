import { action, injectable, state, useConnector, ViewModule } from 'reactant';

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
export class CView extends ViewModule {
  constructor(private counter: Counter) {
    super();
  }

  component() {
    const count = useConnector(() => this.counter.count);

    return (
      <>
        <button type="button" onClick={() => this.counter.decrease()}>
          -
        </button>
        <div>{count}</div>
        <button type="button" onClick={() => this.counter.increase()}>
          +
        </button>
      </>
    );
  }
}

@injectable()
export class AppView extends ViewModule {
  constructor(private counter: Counter, private cView: CView) {
    super();
  }

  component() {
    const count = useConnector(() => this.counter.count);

    return (
      <>
        <this.cView.component />
        <button type="button" onClick={() => this.counter.decrease()}>
          -
        </button>
        <div>{count}</div>
        <button type="button" onClick={() => this.counter.increase()}>
          +
        </button>
      </>
    );
  }
}
