import { BrowserHome } from '@procyonidae/browser/home/feature';
import { BrowserScreen } from '@procyonidae/browser/screen/feature/shell';
import { BrowserSettings } from '@procyonidae/browser/settings/feature/shell';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <BrowserHome />
        </Route>
        <Route path="/screen">
          <BrowserScreen />
        </Route>
        <Route path="/settings">
          <BrowserSettings />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
