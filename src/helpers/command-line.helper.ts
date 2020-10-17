import { PropertyOptions, ArgumentConfig, ArgumentOptions, CommandLineOption } from '../contracts';

export function createCommandLineConfig<T>(config: ArgumentOptions<T>): CommandLineOption[] {
    return Object.keys(config).map((key) => {
        const argConfig: any = config[key as keyof T];
        const definition: PropertyOptions<any> = typeof argConfig === 'object' ? argConfig : { type: argConfig };

        return { name: key, ...definition };
    });
}

export function normaliseConfig<T>(config: ArgumentConfig<T>): ArgumentOptions<T> {
    Object.keys(config).forEach((key) => {
        const argConfig: any = config[key as keyof T];
        config[key as keyof T] = typeof argConfig === 'object' ? argConfig : { type: argConfig };
    });

    return config as ArgumentOptions<T>;
}

export function mergeConfig<T>(
    parsedConfig: Partial<T>,
    fileContent: Record<string, unknown>,
    options: ArgumentOptions<T>,
    configParam?: keyof T,
): Partial<T> {
    const configPath: string | undefined = configParam ? (parsedConfig[configParam] as any) : undefined;
    const configFromFile = resolveConfigFromFile(fileContent, configPath);
    if (configFromFile == null) {
        throw new Error(`Could not resolve config object from specified file and path`);
    }
    return { ...applyTypeConversion(configFromFile, options), ...parsedConfig };
}

function resolveConfigFromFile<T>(configfromFile: any, configPath?: string): Partial<Record<keyof T, any>> {
    if (configPath == null || configPath == '') {
        return configfromFile as Partial<Record<keyof T, any>>;
    }
    const paths = configPath.split('.');
    const key = paths.shift();

    if (key == null) {
        return configfromFile;
    }

    const config = configfromFile[key];
    return resolveConfigFromFile(config, paths.join('.'));
}

function applyTypeConversion<T>(
    configfromFile: Partial<Record<keyof T, any>>,
    options: ArgumentOptions<T>,
): Partial<T> {
    const transformedParams: Partial<T> = {};

    Object.keys(configfromFile).forEach((prop) => {
        const key = prop as keyof T;
        const argumentOptions = options[key];
        if (argumentOptions == null) {
            return;
        }
        const fileValue = configfromFile[key];
        if (argumentOptions.multiple || argumentOptions.lazyMultiple) {
            const fileArrayValue = Array.isArray(fileValue) ? fileValue : [fileValue];

            transformedParams[key] = fileArrayValue.map(argumentOptions.type) as any;
        } else {
            transformedParams[key] = argumentOptions.type(fileValue) as any;
        }
    });

    return transformedParams;
}

type ArgsAndLastOption = { args: string[]; lastOption?: PropertyOptions<any> };
type PartialAndLastOption<T> = {
    partial: Partial<T>;
    lastOption?: PropertyOptions<any>;
    lastName?: Extract<keyof T, string>;
};
const argNameRegExp = /^-{1,2}(\w+)(=(\w+))?$/;
const booleanValue = ['1', '0', 'true', 'false'];

/**
 * commandLineArgs throws an error if we pass aa value for a boolean arg as follows:
 * myCommand -a=true --booleaanArg=false --otherArg true
 * this function removes these booleans so as to avoid errors from commandLineArgs
 * @param args
 * @param config
 */
export function removeBooleanValues<T>(args: string[], config: ArgumentOptions<T>): string[] {
    function removeBooleanArgs(argsAndLastValue: ArgsAndLastOption, arg: string): ArgsAndLastOption {
        const { argOptions, argValue } = getParamConfig(arg, config);

        if (isBoolean(argsAndLastValue.lastOption) && booleanValue.some((boolValue) => boolValue === arg)) {
            const args = argsAndLastValue.args.concat();
            args.pop();
            return { args };
        } else if (isBoolean(argOptions) && argValue != null) {
            return { args: argsAndLastValue.args };
        } else {
            return { args: [...argsAndLastValue.args, arg], lastOption: argOptions };
        }
    }

    return args.reduce<ArgsAndLastOption>(removeBooleanArgs, { args: [] }).args;
}

/**
 * Gets the values of anyy boolean arguments that were specified on the commadn line with a value
 * These arguments were removed by removeBooleanValues
 * @param args
 * @param config
 */
export function getBooleanValues<T>(args: string[], config: ArgumentOptions<T>): Partial<T> {
    function getBooleanValues(argsAndLastOption: PartialAndLastOption<T>, arg: string): PartialAndLastOption<T> {
        const { argOptions, argName, argValue } = getParamConfig(arg, config);

        if (isBoolean(argOptions) && argValue != null && argName != null) {
            argsAndLastOption.partial[argName] = resolveBoolean(argValue, argOptions) as any;
        } else if (
            argsAndLastOption.lastName != null &&
            isBoolean(argsAndLastOption.lastOption) &&
            booleanValue.some((boolValue) => boolValue === arg)
        ) {
            argsAndLastOption.partial[argsAndLastOption.lastName] = resolveBoolean(
                arg,
                argsAndLastOption.lastOption,
            ) as any;
        }
        return { partial: argsAndLastOption.partial, lastName: argName, lastOption: argOptions };
    }

    return args.reduce<PartialAndLastOption<T>>(getBooleanValues, { partial: {} }).partial;
}

function resolveBoolean(value: any, config: PropertyOptions<any>): boolean {
    switch (value) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return config.type(value);
    }
}

function isBoolean(option?: PropertyOptions<any>): option is PropertyOptions<any> {
    return option != null && option.type.name === 'Boolean';
}

function getParamConfig<T>(
    arg: string,
    config: ArgumentOptions<T>,
): { argName?: Extract<keyof T, string>; argOptions?: PropertyOptions<any>; argValue?: string } {
    const regExpResult = argNameRegExp.exec(arg);
    if (regExpResult == null) {
        return {};
    }

    const nameOrAlias = regExpResult[1];

    for (const argName in config) {
        const argConfig = config[argName];

        if (argName === nameOrAlias || argConfig.alias === nameOrAlias) {
            return { argOptions: argConfig as PropertyOptions<any>, argName, argValue: regExpResult[3] };
        }
    }
    return {};
}
