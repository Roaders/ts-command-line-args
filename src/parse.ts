import { ArgumentConfig, ParseOptions, UnkownProperties } from './contracts';
import commandLineArgs from 'command-line-args';
import { normaliseConfig, createCommandLineConfig } from './helpers';

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
    exitProcess = true,
): T | undefined {
    const options = typeof optionsOrExit === 'object' ? optionsOrExit : {};
    exitProcess = typeof optionsOrExit === 'boolean' ? optionsOrExit : exitProcess;
    const commandLineConfig = createCommandLineConfig(normaliseConfig(config));
    const parsedArgs = commandLineArgs(commandLineConfig, options);
    const logger = options.logger || console;

    const missingArgs = commandLineConfig.filter(
        (config) => config.optional == null && parsedArgs[config.name] == null,
    );

    missingArgs.forEach((config) => {
        const aliasMessage = config.alias != null ? ` or '-${config.alias} passedValue'` : ``;
        logger.error(
            `Required parameter '${config.name}' was not passed. Please provide a value by passing '--requiredString=passedValue'${aliasMessage} in command line arguments`,
        );
    });

    if (missingArgs.length > 0 && exitProcess) {
        process.exit();
    } else {
        return parsedArgs as T;
    }
}
