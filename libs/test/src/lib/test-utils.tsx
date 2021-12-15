/**
 * https://testing-library.com/docs/react-testing-library/setup
 */
import { render } from '@testing-library/react';

const AllTheProviders = ({ children }: any) => {
  return children;
};

const customRender: typeof render = (ui: any, options?: any) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  }) as any;

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
