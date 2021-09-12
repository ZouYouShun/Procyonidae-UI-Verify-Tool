import { SnippetModel } from '@procyonidae/browser/shared/models';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface SnippetsStore {
  snippets: SnippetModel[];
  setSnippets: (snippets: SnippetModel[]) => void;
  prevSnippet?: SnippetModel;
  setPrevSnippet: (snippet: SnippetModel) => void;
}

export const useSnippetsStore = create<SnippetsStore>((set, get) => ({
  snippets: [
    {
      key: 'ga',
      value: 'ga7777',
    },
    {
      key: 'git auth',
      value: 'git commit --amend --author="Alan Zou <itisalanlife@gmail.com>"',
    },
  ],
  setSnippets: (snippets) => set({ snippets }),
  prevSnippet: undefined,
  setPrevSnippet: (prevSnippet) => set({ prevSnippet }),
}));
