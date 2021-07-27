import './browser-screen.module.scss';

import { BrowserScreenViewsRecorder } from '@procyonidae/browser/screen/feature/recorder';
import { BrowserScreenViewsScreenshot } from '@procyonidae/browser/screen/feature/screenshot';
import { Link, Route, useRouteMatch } from 'react-router-dom';
import urljoin from 'url-join';

/* eslint-disable-next-line */
export interface BrowserScreenProps {}

export function BrowserScreen(props: BrowserScreenProps) {
  const { url, path } = useRouteMatch();

  return (
    <>
      <Route exact path={path}>
        <h1>Welcome to browser-screen!</h1>
        <ul>
          <li>
            <Link
              className="text-indigo-600 hover:text-indigo-900"
              to={urljoin(url, 'recorder')}
            >
              recorder
            </Link>
          </li>
          <li>
            <Link
              className="text-indigo-600 hover:text-indigo-900"
              to={urljoin(url, 'screenshot')}
            >
              screenshot
            </Link>
          </li>
        </ul>
      </Route>

      <Route exact path={urljoin(path, 'recorder')}>
        <BrowserScreenViewsRecorder />
      </Route>
      <Route path={urljoin(path, 'screenshot')}>
        <BrowserScreenViewsScreenshot />
      </Route>
    </>
  );
}
