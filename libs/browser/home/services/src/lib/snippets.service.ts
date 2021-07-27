import { SnippetModel } from '@procyonidae/browser/shared/models';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface SnippetsStore {
  snippets: SnippetModel[];
  setSnippets: (snippets: SnippetModel[]) => void;
  prevSnippet?: SnippetModel;
  setPrevSnippet: (snippet: SnippetModel) => void;
}

export const useSnippetsStore = create<SnippetsStore>(
  persist(
    (set, get) => ({
      snippets: [
        {
          key: 'a',
          value: 'ga',
        },
        {
          key: 'b',
          value: 'abc',
        },
      ],
      setSnippets: (snippets) => set({ snippets }),
      prevSnippet: undefined,
      setPrevSnippet: (prevSnippet) => set({ prevSnippet }),
    }),
    {
      name: 'snippets', // unique name
      // getStorage: () => , // (optional) by default the 'localStorage' is used
    },
  ),
);
