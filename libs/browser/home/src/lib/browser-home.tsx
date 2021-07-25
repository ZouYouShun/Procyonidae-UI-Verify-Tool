import './browser-home.module.scss';

import { SearchInput, SearchList } from '@procyonidae/browser/home/components';

/* eslint-disable-next-line */
export interface BrowserHomeProps {}

export function BrowserHome(props: BrowserHomeProps) {
  return (
    <>
      <SearchInput />
      <SearchList />
    </>
  );
}

export default BrowserHome;
