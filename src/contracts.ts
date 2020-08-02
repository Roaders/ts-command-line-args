/* eslint-disable no-unused-vars */

export type ArgumentConfig<T extends {[name: string] : any}> = {
    [P in keyof T]-?: PropertyConfig<T[P]>;
}

export type PropertyConfig<T> = undefined extends T ? OptionalPropertyOptions<T>: RequiredPropertyOptions<T>;
export type RequiredPropertyOptions<T> = null extends T ? NullablePropertyOptions<T>: TypeConstructor<T> | PropertyOptions<T>;

export type TypeConstructor<T> = (value: string) => T;

export interface PropertyOptions<T> {
    type: TypeConstructor<T>,
}

export interface OptionalPropertyOptions<T> extends PropertyOptions<T> {
    optional: true;
}

export interface NullablePropertyOptions<T> extends PropertyOptions<T> {
    nullable: true;
}
