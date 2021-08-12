import './browser-snippets-feature.module.scss';

import { useSnippetsStore } from '@procyonidae/browser/home/services';
import {
  useContextBridge,
  useKeyboardMoveFocus,
  useResizeObserver,
} from '@procyonidae/browser/shared/hooks';
import { SnippetModel } from '@procyonidae/browser/shared/models';
import {
  getSelectionPosition,
  setSelectionPosition,
} from '@procyonidae/browser/shared/utils';
import { BrowserSnippetsUiSearchInput } from '@procyonidae/browser/snippets/components/search-input';
import { BrowserSnippetsUiSearchList } from '@procyonidae/browser/snippets/components/search-list';
import { useEffect, useRef, useState } from 'react';

/* eslint-disable-next-line */
export interface BrowserSnippetsFeatureProps {}

export function BrowserSnippetsFeature(props: BrowserSnippetsFeatureProps) {
  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [textValue, setTextValue] = useState('');

  const { hide, snippet } = useContextBridge();

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

  const open = highlightedIndex !== -1;

  const currPrevSnippet = items[highlightedIndex] || prevSnippet;

  const placeholder = currPrevSnippet?.key || 'Search snippet for auto typing';

  useResizeObserver(
    mainRef,
    ([e]) => {
      snippet.setHeight(e.contentRect.height);
    },
    {
      mode: 'none',
    },
  );

  return (
    <main ref={mainRef}>
      <BrowserSnippetsUiSearchInput
        placeholder={placeholder}
        InputProps={{
          ref: inputRef,
          value: textValue,
          onChange: (e) => {
            const value = e.target.value.toLocaleLowerCase();

            setItems(
              snippets.filter((e) => {
                const itemSearchText = e.key.toLocaleLowerCase();

                return itemSearchText.includes(value);
              }),
            );
            setTextValue(value);

            setHighlightedIndex(value.length === 0 ? -1 : 0);
          },
          onKeyDown: async (e) => {
            switch (e.key) {
              case 'Enter':
                const currItem = items[highlightedIndex];

                if (currItem) {
                  setPrevSnippet(currItem);
                }

                await snippet.confirm(currItem.value);

                hide();
                setTextValue('');
                break;
              case 'Escape':
                setHighlightedIndex(-1);
                hide();
                break;
              case 'ArrowRight':
                if (currPrevSnippet && inputRef.current) {
                  const caretPosition = getSelectionPosition(inputRef);

                  const searchText =
                    inputRef.current.value.toLocaleLowerCase() || '';

                  const prevKey = currPrevSnippet.key;

                  if (
                    caretPosition.position.end === searchText.length &&
                    searchText !== prevKey
                  ) {
                    setTextValue(prevKey);

                    const lastPosition = prevKey.length;

                    setTimeout(() => {
                      setSelectionPosition(inputRef, {
                        start: lastPosition,
                        end: lastPosition,
                      });
                    }, 0);
                    // this.change(this.searchText);
                    // add timeout make that after next render
                    // setTimeout(() => {
                    //   setCursor(
                    //     this.textField.nativeElement,
                    //     this.searchText.length,
                    //   );
                    // }, 0);
                  }
                }
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
      {open && (
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
      )}
    </main>
  );
}

export default BrowserSnippetsFeature;
