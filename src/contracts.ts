/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionDefinition } from 'command-line-args'

export type ArgumentConfig<T extends {[name: string] : any}> = {
    [P in keyof T]-?: PropertyConfig<T[P]>;
}

export type PropertyConfig<T> = undefined extends T ? PropertyOptions<T>: RequiredPropertyOptions<T>;
export type RequiredPropertyOptions<T> = null extends T ? PropertyOptions<T>: NonNullablePropertyOptions<T> | PropertyOptions<T>;
export type NonNullablePropertyOptions<T> = Array<any> extends T ? PropertyOptions<T>: TypeConstructor<T> | PropertyOptions<T>

export type TypeConstructor<T> = (value: string) => T extends Array<infer R> ? R: T;

export type PropertyOptions<T> = IPropertyOptions<T> & OptionalPropertyOptions<T> & NullablePropertyOptions<T> & MultiplePropertyOptions<T>

export interface IPropertyOptions<T> extends Omit<OptionDefinition, "name">{
    type: TypeConstructor<T>
}

export type OptionalPropertyOptions<T> = undefined extends T ? {optional: true} : unknown

export type NullablePropertyOptions<T> = null extends T ? {nullable: true} : unknown

export type MultiplePropertyOptions<T> =  T extends Array<any> ? {multiple: true} : unknown


export const bConstr: TypeConstructor<boolean> = Boolean;
