import './browser-home.module.scss';

import { SearchInput, SearchList } from '@procyonidae/browser/home/components';
import { url } from 'node:inspector';
import { Link, useRouteMatch } from 'react-router-dom';
import urljoin from 'url-join';

/* eslint-disable-next-line */
export interface BrowserHomeProps {}

export function BrowserHome(props: BrowserHomeProps) {
  const { url, path } = useRouteMatch();

  return (
    <>
      <SearchInput />
      <SearchList />
      <ul>
        <li>
          <Link
            className="text-indigo-600 hover:text-indigo-900"
            to={urljoin(url, 'screen')}
          >
            screen
          </Link>
        </li>
        <li>
          <Link
            className="text-indigo-600 hover:text-indigo-900"
            to={urljoin(url, 'settings')}
          >
            settings
          </Link>
        </li>
      </ul>
    </>
  );
}

export default BrowserHome;
