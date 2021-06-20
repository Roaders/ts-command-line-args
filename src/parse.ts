import {
    ArgumentConfig,
    ParseOptions,
    UnknownProperties,
    CommandLineOption,
    UsageGuideOptions,
    Content,
} from './contracts';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import {
    createCommandLineConfig,
    getBooleanValues,
    mergeConfig,
    normaliseConfig,
    removeBooleanValues,
    visit,
} from './helpers';
import { getOptionSections } from './helpers/options.helper';
import { removeAdditionalFormatting } from './helpers/string.helper';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function parse<T, P extends ParseOptions<T> = ParseOptions<T>>(
    config: ArgumentConfig<T>,
    options: P = {} as any,
    exitProcess = true,
): T & UnknownProperties<P> {
    options = options || {};
    const argsWithBooleanValues = options.argv || process.argv.slice(2);
    const logger = options.logger || console;
    const normalisedConfig = normaliseConfig(config);
    options.argv = removeBooleanValues(argsWithBooleanValues, normalisedConfig);
    const optionList = createCommandLineConfig(normalisedConfig);
    let parsedArgs = commandLineArgs(optionList, options) as any;

    if (parsedArgs['_all'] != null) {
        const unknown = parsedArgs['_unknown'];
        parsedArgs = parsedArgs['_all'];
        if (unknown) {
            parsedArgs['_unknown'] = unknown;
        }
    }

    const booleanValues = getBooleanValues(argsWithBooleanValues, normalisedConfig);
    parsedArgs = { ...parsedArgs, ...booleanValues };

    if (options.loadFromFileArg != null && parsedArgs[options.loadFromFileArg] != null) {
        const configFromFile: Partial<Record<keyof T, any>> = JSON.parse(
            readFileSync(resolve(parsedArgs[options.loadFromFileArg])).toString(),
        );
        const parsedArgsWithoutDefaults = commandLineArgs(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            optionList.map(({ defaultValue, ...option }) => ({ ...option })),
            options,
        ) as any;

        parsedArgs = mergeConfig<T>(
            parsedArgs,
            { ...parsedArgsWithoutDefaults, ...booleanValues },
            configFromFile,
            normalisedConfig,
            options.loadFromFileJsonPathArg as keyof T | undefined,
        );
    }

    const missingArgs = listMissingArgs(optionList, parsedArgs);

    if (options.helpArg != null && (parsedArgs as any)[options.helpArg]) {
        printHelpGuide(options, optionList, logger);

        if (exitProcess) {
            return process.exit();
        }
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
        return parsedArgs as T & UnknownProperties<P>;
    }
}

function printHelpGuide<T>(options: ParseOptions<T>, optionList: CommandLineOption<T>[], logger: Console) {
    const sections = [
        ...(options.headerContentSections?.filter(filterCliSections) || []),
        ...getOptionSections(options).map((option) => ({ ...option, optionList })),
        ...(options.footerContentSections?.filter(filterCliSections) || []),
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
}

function filterCliSections(section: Content): boolean {
    return section.includeIn == null || section.includeIn === 'both' || section.includeIn === 'cli';
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
            if (config.type.name === 'Boolean') {
                parsedArgs[config.name] = false;
                return false;
            }

            return true;
        });
}
