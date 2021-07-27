import './browser-snippets-feature.module.scss';

import { useSnippetsStore } from '@procyonidae/browser/home/services';
import { useKeyboardMoveFocus } from '@procyonidae/browser/shared/hooks';
import { SnippetModel } from '@procyonidae/browser/shared/models';
import { BrowserSnippetsUiSearchInput } from '@procyonidae/browser/snippets/components/search-input';
import { BrowserSnippetsUiSearchList } from '@procyonidae/browser/snippets/components/search-list';
import { useRef, useState } from 'react';

/* eslint-disable-next-line */
export interface BrowserSnippetsFeatureProps {}

export function BrowserSnippetsFeature(props: BrowserSnippetsFeatureProps) {
  const containerRef = useRef(null);

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const { snippets, prevSnippet, setPrevSnippet } = useSnippetsStore();

  const [items, setItems] = useState<SnippetModel[]>(snippets);

  const { onKeyFocusedIndexHandle } = useKeyboardMoveFocus({
    options: items,
    focusedIndexRef: { current: highlightedIndex },
    infinite: true,
    onFocusedIndexChange: (event, toIndex) => {
      setHighlightedIndex(toIndex);

      event.preventDefault();
    },
  });

  return (
    <>
      <BrowserSnippetsUiSearchInput
        InputProps={{
          placeholder: prevSnippet
            ? prevSnippet.key
            : 'Search snippet for auto typing',
          onChange: (e) => {
            const value = e.target.value.toLocaleLowerCase();
            const result = snippets.filter((e) => {
              const itemSearchText = e.value
                .replace(/\s/g, '')
                .toLocaleLowerCase();

              return itemSearchText.includes(value);
            });
            setHighlightedIndex(0);
            setItems(result);
          },
          onKeyDown: (e) => {
            switch (e.key) {
              case 'Enter':
                const currItem = items[highlightedIndex];

                if (currItem) {
                  setPrevSnippet(currItem);
                }
                break;
              case 'Escape':
                break;

              default:
                onKeyFocusedIndexHandle(e);
                break;
            }
          },
        }}
        onSetting={() => {
          console.log('go setting');
        }}
      />
      <BrowserSnippetsUiSearchList
        ref={containerRef}
        items={items}
        highlightedIndex={highlightedIndex}
        onItemClick={(currItem) => {
          setPrevSnippet(currItem);
        }}
        onItemHover={(index) => {
          setHighlightedIndex(index);
        }}
      />
    </>
  );
}

export default BrowserSnippetsFeature;
