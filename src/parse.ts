import { ArgumentConfig, ParseOptions, UnkownProperties } from './contracts';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { normaliseConfig, createCommandLineConfig, CommandLineOption } from './helpers';

export function parse<T, P extends ParseOptions<T> = ParseOptions<T>>(
    config: ArgumentConfig<T>,
    options: P = {} as any,
    exitProcess = true,
): T & UnkownProperties<P> {
    options = options || {};
    const logger = options.logger || console;
    const optionList = createCommandLineConfig(normaliseConfig(config));
    const parsedArgs = commandLineArgs(optionList, options);

    const missingArgs = listMissingArgs(optionList, parsedArgs);

    if (options.helpArg != null && (parsedArgs as any)[options.helpArg]) {
        const usageGuide = commandLineUsage([
            ...(options.headerContentSections || []),
            { header: 'Options', optionList },
            ...(options.footerContentSections || []),
        ]);

        logger.log(usageGuide);
    } else {
        printMissingArgErrors(missingArgs, logger);
    }

    if (missingArgs.length > 0 && exitProcess) {
        process.exit();
    } else {
        return parsedArgs as T & UnkownProperties<P>;
    }
}

function printMissingArgErrors(missingArgs: CommandLineOption[], logger: Console) {
    missingArgs.forEach((config) => {
        const aliasMessage = config.alias != null ? ` or '-${config.alias} passedValue'` : ``;
        logger.error(
            `Required parameter '${config.name}' was not passed. Please provide a value by passing '--${config.name}=passedValue'${aliasMessage} in command line arguments`,
        );
    });
}

function listMissingArgs<T>(commandLineConfig: CommandLineOption[], parsedArgs: commandLineArgs.CommandLineOptions) {
    return commandLineConfig
        .filter((config) => config.optional == null && parsedArgs[config.name] == null)
        .filter((config) => {
            const defaultedValue = config.type();

            if (typeof defaultedValue === 'boolean') {
                parsedArgs[config.name] = defaultedValue;
                return false;
            }

            return true;
        });
}
