import { PropertyOptions, ArgumentConfig } from './contracts';
import { OptionDefinition } from 'command-line-args';

export type ArgumentOptions<T extends { [name: string]: any }> = {
    [P in keyof T]-?: PropertyOptions<T[P]>;
};

export function createCommandLineConfig<T>(config: ArgumentOptions<T>): ({ optional?: true } & OptionDefinition)[] {
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
