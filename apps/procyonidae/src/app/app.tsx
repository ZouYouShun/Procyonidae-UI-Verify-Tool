import { BrowserHome } from '@procyonidae/browser/home';
import { BrowserSettings } from '@procyonidae/browser/settings';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <BrowserHome />
        </Route>
        <Route path="/settings">
          <BrowserSettings />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
