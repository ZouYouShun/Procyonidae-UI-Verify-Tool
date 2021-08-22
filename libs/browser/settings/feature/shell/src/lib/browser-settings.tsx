import './browser-settings.module.scss';

import { BrowserSettingsViewsAccount } from '@procyonidae/browser/settings/feature/account';
import { BrowserSettingsViewsSnippets } from '@procyonidae/browser/settings/feature/snippets';
import { BrowserSettingsFeatureSpeechToText } from '@procyonidae/browser/settings/feature/speech-to-text';
import { Link, Route, useRouteMatch } from 'react-router-dom';
import urljoin from 'url-join';

{
  /* <Route exact path={path}>
<h1>Welcome to browser-settings!</h1>
<ul>
  <li>
    <Link
      className="text-indigo-600 hover:text-indigo-900"
      to={urljoin(url, 'account')}
    >
      account
    </Link>
  </li>
  <li>
    <Link
      className="text-indigo-600 hover:text-indigo-900"
      to={urljoin(url, 'snippets')}
    >
      snippets
    </Link>
  </li>
  <li>
    <Link
      className="text-indigo-600 hover:text-indigo-900"
      to={urljoin(url, 'speech-to-text')}
    >
      speech-to-text
    </Link>
  </li>
</ul>
</Route>
<Route exact path={urljoin(path, 'account')}>
<BrowserSettingsViewsAccount />
</Route>
<Route path={urljoin(path, 'snippets')}>
<BrowserSettingsViewsSnippets />
</Route>
<Route path={urljoin(path, 'speech-to-text')}>
<BrowserSettingsFeatureSpeechToText />
</Route> */
}

/* eslint-disable-next-line */
export interface BrowserSettingsProps {}

const routes = [
  {
    path: 'snippets',
    component: BrowserSettingsViewsSnippets,
    data: {
      title: 'Snippets',
    },
  },
  {
    path: 'speech-to-text',
    component: BrowserSettingsFeatureSpeechToText,
    data: {
      title: 'Speech',
    },
  },
  {
    path: 'account',
    component: BrowserSettingsViewsAccount,
    data: {
      title: 'Account',
    },
  },
];

export function BrowserSettings(props: BrowserSettingsProps) {
  const { url, path } = useRouteMatch();

  return (
    <section className="container">
      <nav className="w-25 p-3">
        <header className="d-flex pb-3">
          <h2>
            <Link to={url}>AstralStar</Link>
          </h2>
        </header>
        <ul>
          {routes.map((route) => {
            return (
              <li key={route.path}>
                <Link
                  className="text-indigo-600 hover:text-indigo-900"
                  to={urljoin(url, route.path)}
                >
                  {route.data.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <main className="py-3 pl-0 w-100">
        <Route exact path={path}>
          <h1>Welcome to browser-settings!</h1>
        </Route>
        {routes.map((route) => {
          const Component = route.component;
          return (
            <Route exact path={urljoin(path, route.path)}>
              <Component />
            </Route>
          );
        })}
      </main>
    </section>
  );
}

export default BrowserSettings;
