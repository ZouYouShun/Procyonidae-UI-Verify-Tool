import './home.module.scss';

import SearchBar from './components/search-bar/search-bar';
import SearchList from './components/search-list/search-list';

export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <>
      <SearchBar />
      <SearchList />
    </>
  );
}

export default Home;
