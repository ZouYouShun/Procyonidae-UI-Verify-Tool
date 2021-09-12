import './browser-settings.module.scss';

import { BrowserSettingsViewsAccount } from '@procyonidae/browser/settings/feature/account';
import { BrowserSettingsViewsSnippets } from '@procyonidae/browser/settings/feature/snippets';
import { BrowserSettingsFeatureSpeechToText } from '@procyonidae/browser/settings/feature/speech-to-text';
import { Link, NavLink, Route, useRouteMatch } from 'react-router-dom';
import urljoin from 'url-join';

/* eslint-disable-next-line */
export interface BrowserSettingsProps {}

const routes = [
  {
    path: 'account',
    component: BrowserSettingsViewsAccount,
    data: {
      title: 'Account',
    },
  },
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
];

export function BrowserSettings(props: BrowserSettingsProps) {
  const { url, path } = useRouteMatch();

  return (
    <section className="flex min-h-screen bg-gray-300">
      <nav className="w-60 bg-gray-900 p-3">
        <header className="flex justify-center">
          <Link className="text-4xl text-white m-3" to={url}>
            AstralStar
          </Link>
        </header>
        {routes.map((route) => {
          return (
            <NavLink
              key={route.path}
              className="flex text-gray-100 text-opacity-50 hover:bg-gray-700 hover:bg-opacity-25 hover:text-opacity-100 items-center mt-4 px-6 py-2 "
              activeClassName="bg-gray-700 text-opacity-100 hover:bg-opacity-100"
              to={urljoin(url, route.path)}
            >
              {route.data.title}
            </NavLink>
          );
        })}
      </nav>
      <main className="p-3 flex-auto overflow-auto h-screen">
        <Route exact path={path}>
          <h1>Welcome to browser-settings!</h1>
        </Route>
        {routes.map((route) => {
          const Component = route.component;
          return (
            <Route key={route.path} path={urljoin(path, route.path)}>
              <Component />
            </Route>
          );
        })}
      </main>
    </section>
  );
}

export default BrowserSettings;
