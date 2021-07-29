import { originalListensMapKey } from '../constant';
import { Transport } from '../transport';

export const listen = (
  target: Transport,
  key: string,
  descriptor: TypedPropertyDescriptor<(...args: any) => Promise<any>>,
) => {
  const fn = descriptor.value;
  if (typeof fn !== 'function') {
    console.warn(
      `The decorator '@listen' can only decorate methods, '${key}' is NOT a methods.`,
    );
    return descriptor;
  }
  target[originalListensMapKey] ??= {};
  target[originalListensMapKey][key] = fn!;
  return {
    ...descriptor,
    value(this: Transport) {
      throw new Error(
        `The method '${key}' is a listen function that can NOT be actively called.`,
      );
      return Promise.resolve();
    },
  };
};
