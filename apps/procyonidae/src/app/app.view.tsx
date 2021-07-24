import { action, injectable, state, useConnector, ViewModule } from 'reactant';
import { Rainbowfish } from '@procyonidae/rainbowfish';
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
      <div className="bg-gray-50">
        <Rainbowfish />
      </div>
    );
  }
}
