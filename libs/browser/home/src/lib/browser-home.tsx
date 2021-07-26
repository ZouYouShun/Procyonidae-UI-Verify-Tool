import './browser-home.module.scss';

import { SearchInput, SearchList } from '@procyonidae/browser/home/components';
import { url } from 'node:inspector';
import { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import urljoin from 'url-join';

/* eslint-disable-next-line */
export interface BrowserHomeProps {}

export function BrowserHome(props: BrowserHomeProps) {
  const { url, path } = useRouteMatch();
  const [image, setImage] = useState('');

  const handleClick = async () => {
    const { screenshots } = (window as any).electron;
    const { dataURL } = await screenshots.open();
    setImage(dataURL);
  };

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

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleClick}
      >
        Screenshot!
      </button>
      <img src={image} />
    </>
  );
}

export default BrowserHome;
