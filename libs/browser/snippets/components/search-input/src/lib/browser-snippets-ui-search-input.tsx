import './browser-snippets-ui-search-input.module.scss';

/* eslint-disable-next-line */
export interface BrowserSnippetsUiSearchInputProps {
  InputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  onSetting: () => void;
}

export function BrowserSnippetsUiSearchInput({
  InputProps,
  onSetting,
}: BrowserSnippetsUiSearchInputProps) {
  return (
    <div className="bg-white flex items-center rounded-full shadow-xl">
      <input
        className="rounded-l-full w-full py-4 px-6 text-gray-700 focus:outline-none"
        id="search"
        type="text"
        {...InputProps}
      />
      <button
        className="m-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
        onClick={onSetting}
      >
        icon
      </button>
    </div>
  );
}

export default BrowserSnippetsUiSearchInput;
