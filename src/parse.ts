import { ArgumentConfig, ParseOptions, UnkownProperties } from './contracts';
import { OptionDefinition } from 'command-line-args';

export function parse<T>(config: ArgumentConfig<T>, exitProcess: false): T | undefined;
export function parse<T, P extends ParseOptions>(
    config: ArgumentConfig<T>,
    options: P,
    exitProcess: false,
): (T & UnkownProperties<P>) | undefined;
export function parse<T, P extends ParseOptions>(
    config: ArgumentConfig<T>,
    options?: P,
    exitProcess?: true,
): T & UnkownProperties<P>;
export function parse<T>(
    config: ArgumentConfig<T>,
    optionsOrExit?: ParseOptions | boolean,
    exitProcess?: boolean,
): T | undefined {
    return undefined;
}

export function createCommandLineConfig<T>(config: ArgumentConfig<T>): OptionDefinition[] {
    return Object.keys(config).map((key) => {
        const argConfig = config[key as keyof T];
        const definition: any = typeof argConfig === 'object' ? argConfig : { type: argConfig };

        return { name: key, ...definition };
    });
}
