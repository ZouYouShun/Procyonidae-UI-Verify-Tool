import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './pages/home/home';
import Settings from './pages/settings/settings';

export function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
