import { ArgumentConfig, ParseOptions, UnkownProperties, CommandLineOption, UsageGuideOptions } from './contracts';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { createCommandLineConfig, normaliseConfig, visit } from './helpers';
import { getOptionSections } from './helpers/options.helper';
import { removeAdditionalFormatting } from './helpers/string.helper';

export function parse<T, P extends ParseOptions<T> = ParseOptions<T>>(
    config: ArgumentConfig<T>,
    options: P = {} as any,
    exitProcess = true,
): T & UnkownProperties<P> {
    options = options || {};
    const logger = options.logger || console;
    const normalisedConfig = normaliseConfig(config);
    const optionList = createCommandLineConfig(normalisedConfig);
    let parsedArgs = commandLineArgs(optionList, options) as any;

    if (parsedArgs['_all'] != null) {
        parsedArgs = parsedArgs['_all'];
    }

    const missingArgs = listMissingArgs(optionList, parsedArgs);

    if (options.helpArg != null && (parsedArgs as any)[options.helpArg]) {
        const sections = [
            ...(options.headerContentSections || []),
            ...getOptionSections(options).map((option) => ({ ...option, optionList })),
            ...(options.footerContentSections || []),
        ];

        visit(sections, (value) => {
            switch (typeof value) {
                case 'string':
                    return removeAdditionalFormatting(value);
                default:
                    return value;
            }
        });

        const usageGuide = commandLineUsage(sections);

        logger.log(usageGuide);
    } else if (missingArgs.length > 0) {
        printMissingArgErrors(missingArgs, logger, options.baseCommand);
        printUsageGuideMessage(
            { ...options, logger },
            options.helpArg != null ? optionList.filter((option) => option.name === options.helpArg)[0] : undefined,
        );
    }

    if (missingArgs.length > 0 && exitProcess) {
        process.exit();
    } else {
        return parsedArgs as T & UnkownProperties<P>;
    }
}

function printMissingArgErrors(missingArgs: CommandLineOption[], logger: Console, baseCommand?: string) {
    baseCommand = baseCommand ? `${baseCommand} ` : ``;
    missingArgs.forEach((config) => {
        const aliasMessage = config.alias != null ? ` or '${baseCommand}-${config.alias} passedValue'` : ``;
        const runCommand =
            baseCommand !== ''
                ? `running '${baseCommand}--${config.name}=passedValue'${aliasMessage}`
                : `passing '--${config.name}=passedValue'${aliasMessage} in command line arguments`;
        logger.error(`Required parameter '${config.name}' was not passed. Please provide a value by ${runCommand}`);
    });
}

function printUsageGuideMessage(options: UsageGuideOptions & { logger: Console }, helpParam?: CommandLineOption) {
    if (helpParam != null) {
        const helpArg = helpParam.alias != null ? `-${helpParam.alias}` : `--${helpParam.name}`;
        const command = options.baseCommand != null ? `run '${options.baseCommand} ${helpArg}'` : `pass '${helpArg}'`;

        options.logger.log(`To view the help guide ${command}`);
    }
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
