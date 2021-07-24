import './search-list.module.scss';

/* eslint-disable-next-line */
export interface SearchListProps {}

export function SearchList(props: SearchListProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-xl rounded-lg w-full">
        <ul className="divide-y divide-gray-300">
          <li className="p-4 hover:bg-gray-50 cursor-pointer">
            Peli list ni item
          </li>
          <li className="p-4 hover:bg-gray-50 cursor-pointer">
            Biji list ni item{' '}
          </li>
          <li className="p-4 hover:bg-gray-50 cursor-pointer">
            Triji list ni item
          </li>
          <li className="p-4 hover:bg-gray-50 cursor-pointer">
            Chothi list ni item
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SearchList;
