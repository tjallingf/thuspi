import type ModelWithProps from '@/zylax/lib/ModelWithProps';
export type Constructor<T> = new (...args: any[]) => T;
export type GetTPropsSerialized<M extends ModelWithProps<any, any>> = M extends ModelWithProps<any, infer S> ? S : never;