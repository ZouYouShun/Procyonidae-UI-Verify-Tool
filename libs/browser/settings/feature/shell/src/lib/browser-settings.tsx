import './browser-settings.module.scss';

import { BrowserSettingsViewsAccount } from '@procyonidae/browser/settings/feature/account';
import { BrowserSettingsViewsSnippets } from '@procyonidae/browser/settings/feature/snippets';
import { Link, Route, useRouteMatch } from 'react-router-dom';
import urljoin from 'url-join';

/* eslint-disable-next-line */
export interface BrowserSettingsProps {}

export function BrowserSettings(props: BrowserSettingsProps) {
  const { url, path } = useRouteMatch();

  return (
    <>
      <Route exact path={path}>
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
        </ul>
      </Route>
      <Route exact path={urljoin(path, 'account')}>
        <BrowserSettingsViewsAccount />
      </Route>
      <Route path={urljoin(path, 'snippets')}>
        <BrowserSettingsViewsSnippets />
      </Route>
    </>
  );
}

export default BrowserSettings;
