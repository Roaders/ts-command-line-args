/* eslint-disable @typescript-eslint/no-explicit-any */

export type ArgumentConfig<T extends { [name: string]: any }> = {
    [P in keyof T]-?: PropertyConfig<T[P]>;
}

export type PropertyConfig<T> = undefined extends T ? PropertyOptions<T> : RequiredPropertyOptions<T>;
export type RequiredPropertyOptions<T> = null extends T ? PropertyOptions<T> : NonNullablePropertyOptions<T> | PropertyOptions<T>;
export type NonNullablePropertyOptions<T> = Array<any> extends T ? PropertyOptions<T> : TypeConstructor<T> | PropertyOptions<T>

export type TypeConstructor<T> = (value: string) => T extends Array<infer R> ? R : T;

export type PropertyOptions<T> = {
    /**
     * A setter function (you receive the output from this) enabling you to be specific about the type and value received. Typical values
     * are `String`, `Number` and `Boolean` but you can use a custom function.
     */
    type: TypeConstructor<T>

    /**
     * A getopt-style short option name. Can be any single character except a digit or hyphen.
     */
    alias?: string;

    /**
     * Set this flag if the option accepts multiple values. In the output, you will receive an array of values each passed through the `type` function.
     */
    multiple?: boolean;

    /**
     * Identical to `multiple` but with greedy parsing disabled.
     */
    lazyMultiple?: boolean;

    /**
     * Any values unaccounted for by an option definition will be set on the `defaultOption`. This flag is typically set
     * on the most commonly-used option to enable more concise usage.
     */
    defaultOption?: boolean;

    /**
     * An initial value for the option.
     */
    defaultValue?: T;

    /**
     * One or more group names the option belongs to.
     */
    group?: string | string[];
}  & OptionalPropertyOptions<T> & NullablePropertyOptions<T> & MultiplePropertyOptions<T>

export type OptionalPropertyOptions<T> = undefined extends T ? { optional: true } : unknown

export type NullablePropertyOptions<T> = null extends T ? { nullable: true } : unknown

export type MultiplePropertyOptions<T> = Array<any> extends T ? { multiple: true } | { lazyMultiple: true } : unknown

export interface ArgsParseOptions {
    /**
     * An array of strings which if present will be parsed instead of `process.argv`.
     */
    argv?: string[];
}

export interface PartialParseOptions extends ArgsParseOptions{

    /**
     * If `true`, `commandLineArgs` will not throw on unknown options or values, instead returning them in the `_unknown` property of the output.
     */
    partial: true;

}

export interface StopParseOptions extends ArgsParseOptions{

    /**
     * If `true`, `commandLineArgs` will not throw on unknown options or values. Instead, parsing will stop at the first unknown argument
     * and the remaining arguments returned in the `_unknown` property of the output. If set, `partial: true` is implied.
     */
    stopAtFirstUnknown: true;
}

type UnknownProps = { _unknown: string[] };

export type UnkownProperties<T> = T extends PartialParseOptions ?  UnknownProps :  T extends StopParseOptions ? UnknownProps : unknown;

export type ParseOptions = ArgsParseOptions | PartialParseOptions | StopParseOptions;
