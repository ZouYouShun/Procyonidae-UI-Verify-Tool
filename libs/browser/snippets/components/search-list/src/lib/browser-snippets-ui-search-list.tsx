import './browser-snippets-ui-search-list.module.scss';

import { SnippetModel } from '@procyonidae/browser/shared/models';
import clsx from 'clsx';
import { forwardRef } from 'react';

/* eslint-disable-next-line */
export interface BrowserSnippetsUiSearchListProps {
  items: SnippetModel[];
  highlightedIndex: number;
  onItemClick: (item: SnippetModel) => void;
  onItemHover: (item: number) => void;
}

export const BrowserSnippetsUiSearchList = forwardRef<
  any,
  BrowserSnippetsUiSearchListProps
>(({ items, highlightedIndex, onItemClick, onItemHover }, ref) => {
  return (
    <div className="flex justify-center" ref={ref}>
      <div className="bg-white shadow-xl rounded-lg w-full overflow-hidden">
        <ul className="divide-y divide-gray-300">
          {items.map((item, i) => {
            return (
              <li
                className={clsx('p-4 hover:bg-blue-400 cursor-pointer', {
                  'bg-blue-400 text-white': i === highlightedIndex,
                })}
                key={item.key}
                onClick={() => onItemClick(item)}
                onMouseEnter={() => onItemHover(i)}
              >
                {item.key}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export default BrowserSnippetsUiSearchList;
