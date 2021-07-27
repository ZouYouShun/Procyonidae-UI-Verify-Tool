import { BrowserHome } from '@procyonidae/browser/home/feature';
import { BrowserScreen } from '@procyonidae/browser/screen/feature/shell';
import { BrowserSettings } from '@procyonidae/browser/settings/feature/shell';
import { IpcProvider } from '@procyonidae/electron/ipc-transport';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <IpcProvider ipcRenderer={electron.ipcRenderer}>
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
    </IpcProvider>
  );
}

export default App;
