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
