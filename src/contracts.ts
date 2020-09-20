export type ArgumentConfig<T extends { [name: string]: any }> = {
    [P in keyof T]-?: PropertyConfig<T[P]>;
};

export type ArgumentOptions<T extends { [name: string]: any }> = {
    [P in keyof T]-?: PropertyOptions<T[P]>;
};

interface OptionDefinition {
    name: string;
}

export type CommandLineOption<T = any> = PropertyOptions<T> & OptionDefinition;

export type PropertyConfig<T> = undefined extends T ? PropertyOptions<T> : RequiredPropertyOptions<T>;
export type RequiredPropertyOptions<T> = Array<any> extends T
    ? PropertyOptions<T>
    : TypeConstructor<T> | PropertyOptions<T>;

export type TypeConstructor<T> = (value?: string) => T extends Array<infer R> ? R | undefined : T | undefined;

export type PropertyOptions<T> = {
    /**
     * A setter function (you receive the output from this) enabling you to be specific about the type and value received. Typical values
     * are `String`, `Number` and `Boolean` but you can use a custom function.
     */
    type: TypeConstructor<T>;

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
     * When your app has a large amount of options it makes sense to organise them in groups.
     *
     * There are two automatic groups: _all (contains all options) and _none (contains options without a group specified in their definition).
     */
    group?: string | string[];
    /** A string describing the option. */
    description?: string;
    /** A string to replace the default type string (e.g. <string>). It's often more useful to set a more descriptive type label, like <ms>, <files>, <command>, etc.. */
    typeLabel?: string;
} & OptionalPropertyOptions<T> &
    MultiplePropertyOptions<T>;

export type OptionalPropertyOptions<T> = undefined extends T ? { optional: true } : unknown;

export type MultiplePropertyOptions<T> = Array<any> extends T ? { multiple: true } | { lazyMultiple: true } : unknown;

export type HeaderLevel = 1 | 2 | 3 | 4 | 5;

export interface ArgsParseOptions<T extends { [name: string]: any }> {
    /**
     * An array of strings which if present will be parsed instead of `process.argv`.
     */
    argv?: string[];

    /**
     * A logger for printing errors for missing properties.
     * Defaults to console
     */
    logger?: typeof console;

    /**
     * The command line argument used to show help
     * By default when this property is true help will be printed and the process will exit
     */
    helpArg?: keyof T;

    /**
     * help sections to be listed before the options section
     */
    headerContentSections?: Content[];

    /**
     * help sections to be listed after the options section
     */
    footerContentSections?: Content[];

    /**
     * Used when generating error messages.
     * For example if a param is missing and there is a help option the error message will contain:
     *
     * 'To view help guide run myBaseCommand -h'
     */
    baseCommand?: string;

    /**
     * Heading level to use for the options header
     * Only used when generating markdown
     * Defaults to 2
     */
    optionsHeaderLevel?: HeaderLevel;

    /**
     * Heading level text to use for options section
     * defaults to "Options";
     */
    optionsHeaderText?: string;

    /**
     * Used to define multiple options sections. If this is used `optionsHeaderLevel` and `optionsHeaderText` are ignored.
     */
    optionSections?: OptionContent[];
}

export interface PartialParseOptions extends ArgsParseOptions<any> {
    /**
     * If `true`, `commandLineArgs` will not throw on unknown options or values, instead returning them in the `_unknown` property of the output.
     */
    partial: true;
}

export interface StopParseOptions extends ArgsParseOptions<any> {
    /**
     * If `true`, `commandLineArgs` will not throw on unknown options or values. Instead, parsing will stop at the first unknown argument
     * and the remaining arguments returned in the `_unknown` property of the output. If set, `partial: true` is implied.
     */
    stopAtFirstUnknown: true;
}

type UnknownProps = { _unknown: string[] };

export type UnkownProperties<T> = T extends PartialParseOptions
    ? UnknownProps
    : T extends StopParseOptions
    ? UnknownProps
    : unknown;

export type ParseOptions<T> = ArgsParseOptions<T> | PartialParseOptions | StopParseOptions;

export interface SectionHeader {
    /** The section header, always bold and underlined. */
    header?: string;

    /**
     * Heading level to use for the header
     * Only used when generating markdown
     * Defaults to 1
     */
    headerLevel?: HeaderLevel;
}

export interface OptionContent extends SectionHeader {
    /** The group name or names. use '_none' for options without a group */
    group?: string | string[];
}

/** A Content section comprises a header and one or more lines of content. */
export interface Content extends SectionHeader {
    /**
     * Overloaded property, accepting data in one of four formats.
     *  1. A single string (one line of text).
     *  2. An array of strings (multiple lines of text).
     *  3. An array of objects (recordset-style data). In this case, the data will be rendered in table format. The property names of each object are not important, so long as they are
     *     consistent throughout the array.
     *  4. An object with two properties - data and options. In this case, the data and options will be passed directly to the underlying table layout module for rendering.
     */
    content?: string | string[] | any[];
}

export interface IReplaceOptions {
    replaceBelow: string;
    replaceAbove: string;
}

export type JsImport = { jsFile: string; importName: string };

export interface IWriteMarkDown extends IReplaceOptions {
    markdownPath: string;
    jsFile: string[];
    configImportName: string[];
    help: boolean;
    verify: boolean;
}

export type UsageGuideConfig<T = any> = {
    arguments: ArgumentConfig<T>;
    parseOptions?: ParseOptions<T>;
};
