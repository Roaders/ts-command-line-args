import { ArgumentConfig, ParseOptions, UnkownProperties } from './contracts';


export function parse<T> (config: ArgumentConfig<T>, exitProcess: false ): T | undefined;
export function parse<T, P extends ParseOptions> (config: ArgumentConfig<T>, options: P, exitProcess: false ): (T & UnkownProperties<P>) | undefined;
export function parse<T, P extends ParseOptions> (config: ArgumentConfig<T>, options?: P, exitProcess?: true ): T & UnkownProperties<P>;
export function parse<T> (config: ArgumentConfig<T>, optionsOrExit?: ParseOptions | boolean, exitProcess?: boolean ): T | undefined {
    return undefined;
}
