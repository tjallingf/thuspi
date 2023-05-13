import type ModelWithProps from '@/zylax/lib/ModelWithProps';
export type Constructor<T> = new (...args: any[]) => T;
export type GetSerializedProps<M extends ModelWithProps<any, any, any>> = M extends ModelWithProps<any, infer S, any> ? S : unknown;
