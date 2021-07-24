import './search-bar.module.scss';

import React from 'react';

export interface SearchBarProps {}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <div className="bg-white flex items-center rounded-full shadow-xl">
      <input
        className="rounded-l-full w-full py-4 px-6 text-gray-700 focus:outline-none"
        id="search"
        type="text"
        placeholder="Search"
      />
      <button className="m-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center">
        icon
      </button>
    </div>
  );
};
