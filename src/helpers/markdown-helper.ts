import {
    UsageGuideConfig,
    JsImport,
    IWriteMarkDown,
    ArgumentConfig,
    CommandLineOption,
    ParseOptions,
    Content,
    HeaderLevel,
} from '../contracts';
import { join } from 'path';
import { normaliseConfig, createCommandLineConfig } from './command-line.helper';

export function createUsageGuide<T = any>(config: UsageGuideConfig<T>): string {
    const options = config.parseOptions || {};
    const headerSections = options.headerContentSections || [];
    const footerSections = options.footerContentSections || [];

    return [
        ...headerSections.map(createSection),
        createOptionsSection(config.arguments, options),
        ...footerSections.map(createSection),
    ].join('\n');
}

export function createSection(section: Content): string {
    return `
${createHeading(section.header, section.headerLevel || 1)}
${createSectionContent(section)}
`;
}

export function createSectionContent(section: Content): string {
    switch (typeof section.content) {
        case 'string':
            return parseString(section.content);
        default:
            return '';
    }
}

export function createOptionsSection<T>(cliArguments: ArgumentConfig<T>, options: ParseOptions<any>): string {
    const normalisedConfig = normaliseConfig(cliArguments);
    const optionList = createCommandLineConfig(normalisedConfig);
    const anyAlias = optionList.some((option) => option.alias != null);
    const anyDescription = optionList.some((option) => option.description != null);
    const heading = options.optionsHeaderText || 'Options';

    return `
${createHeading(heading, options.optionsHeaderLevel || 2)}
| Argument |${anyAlias ? ' Alias |' : ''} Type |${anyDescription ? ' Description |' : ''}
|-|${anyAlias ? '-|' : ''}-|${anyDescription ? '-|' : ''}
${optionList.map((option) => createOptionRow(option, anyAlias, anyDescription)).join('\n')}
`;
}

export function createHeading(text: string | undefined, level: HeaderLevel): string {
    if (text == null) {
        return '';
    }

    const headingLevel = Array.from({ length: level })
        .map(() => `#`)
        .join('');

    return `${headingLevel} ${text}
`;
}

export function createOptionRow(option: CommandLineOption, includeAlias = true, includeDescription = true): string {
    const alias = includeAlias ? ` ${option.alias == null ? '' : '**' + option.alias + '** '}|` : ``;
    const description = includeDescription
        ? ` ${option.description == null ? '' : parseString(option.description) + ' '}|`
        : ``;
    return `| **${option.name}** |${alias} ${getType(option)}|${description}`;
}

export function getType(option: CommandLineOption): string {
    if (option.typeLabel) {
        return `${parseString(option.typeLabel)} `;
    }

    const type = option.type ? option.type.name.toLowerCase() : 'string';
    const multiple = option.multiple || option.lazyMultiple ? '[]' : '';

    return type === 'boolean' ? '' : `${type}${multiple} `;
}

const chalkStringStyleRegExp = /(?<!\\){([^}]+?) ([^}]+)}/g;
const newLineRegExp = /\n/g;

export function parseString(input: string): string {
    return (
        input
            .replace(chalkStringStyleRegExp, replaceParseMatch)
            //replace new line with 2 spaces then new line
            .replace(newLineRegExp, '  \n')
    );
}

function replaceParseMatch(_substring: string, ...matches: string[]): string {
    let modifier = '';
    if (matches[0].indexOf('bold') >= 0) {
        modifier += '**';
    }
    if (matches[0].indexOf('italic') >= 0) {
        modifier += '*';
    }
    return `${modifier}${matches[1]}${modifier}`;
}

export function generateUsageGuides(args: IWriteMarkDown): string[] {
    function mapJsImports(imports: JsImport[], jsFile: string) {
        return [...imports, ...args.configImportName.map((importName) => ({ jsFile, importName }))];
    }

    return args.jsFile
        .reduce(mapJsImports, new Array<JsImport>())
        .map(({ jsFile, importName }) => loadArgConfig(jsFile, importName))
        .filter(isDefined)
        .map(createUsageGuide);
}

export function loadArgConfig(jsFile: string, importName: string): UsageGuideConfig | undefined {
    const jsPath = join(process.cwd(), jsFile);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsExports = require(jsPath);

    const argConfig: UsageGuideConfig = jsExports[importName];

    if (argConfig == null) {
        console.warn(`Could not import ArgumentConfig named '${importName}' from jsFile '${jsFile}'`);
        return undefined;
    }

    return argConfig;
}

function isDefined<T>(value: T | undefined | null): value is T {
    return value != null;
}
