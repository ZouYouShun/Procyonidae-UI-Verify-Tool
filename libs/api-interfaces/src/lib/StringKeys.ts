type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> &
            string}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;
type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

/**
 * get string array from object key
 *
 * @example
 *
 * ```ts
 * type A = {
 *   a: {
 *     b: number
 *   },
 *   c: {
 *     d: string
 *   },
 * }
 *
 * type B = ToStringKeys<A> // 'a' | 'c' | 'a.b' | 'c.d';
 * ```
 */
export type ToStringKeys<T> = PathImpl2<T> extends string | keyof T
  ? PathImpl2<T>
  : keyof T;

export type StringKeysValue<
  T,
  P extends ToStringKeys<T>,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends ToStringKeys<T[Key]>
      ? StringKeysValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;
