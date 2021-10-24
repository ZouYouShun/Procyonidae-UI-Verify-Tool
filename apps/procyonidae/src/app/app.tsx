import { BrowserHome } from '@procyonidae/browser/home/feature';
import { BrowserScreen } from '@procyonidae/browser/screen/feature/shell';
import { BrowserSettings } from '@procyonidae/browser/settings/feature/shell';
import {
  createGlobalStyle,
  RcDefaultDarkTheme,
  RcGlobalScrollBarStyle,
  RcThemeProvider,
} from '@ringcentral/juno';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

const GlobalStyle = createGlobalStyle``;

// body {
//   background-color: ${palette2('neutral', 'elevation')};
//   height: 100vh;
//   overflow: hidden;
// }

// #root {
//   height: 100%;
// }

export function App() {
  return (
    <RcThemeProvider theme={RcDefaultDarkTheme}>
      <GlobalStyle />
      <RcGlobalScrollBarStyle />
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
    </RcThemeProvider>
  );
}

export default App;
