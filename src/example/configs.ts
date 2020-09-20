/* eslint-disable no-useless-escape */
import { ArgumentConfig, UsageGuideConfig } from '../contracts';

/**
 * we do not have any side effects in this file as this file is required by write-markdown
 * If there were side effects they would be executed when generating markdown
 * The execution for this config is performed in 'example.ts' that imports this file.
 */

export interface ICopyFilesArguments {
    sourcePath: string;
    targetPath: string;
    copyFiles: boolean;
    resetPermissions: boolean;
    filter?: string;
    excludePaths?: string[];
}

export const argumentConfig: ArgumentConfig<ICopyFilesArguments> = {
    sourcePath: String,
    targetPath: String,
    copyFiles: {
        type: Boolean,
        alias: 'c',
        typeLabel: `{underline.bold file[]}`,
        description: `{bold bold text} {italic italic text} {italic.bold bold italic text}`,
    },
    resetPermissions: Boolean,
    filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
};

export const usageGuideInfo: UsageGuideConfig<ICopyFilesArguments> = {
    arguments: argumentConfig,
};

export interface ITypicalAppWithGroups {
    help: boolean;
    src: string[];
    timeout: string;
    plugin: string;
}

const typicalAppConfig: ArgumentConfig<ITypicalAppWithGroups> = {
    help: {
        description: 'Display this usage guide.',
        alias: 'h',
        type: Boolean,
        group: 'main',
    },
    src: {
        description: 'The input files to process',
        multiple: true,
        defaultOption: true,
        typeLabel: '{underline file} ...',
        group: 'input',
        type: String,
    },
    timeout: {
        description: 'Timeout value in ms',
        alias: 't',
        typeLabel: '{underline ms}',
        group: 'main',
        type: String,
    },
    plugin: {
        description: 'A plugin path',
        type: String,
    },
};

export const typicalAppWithGroupsInfo: UsageGuideConfig<ITypicalAppWithGroups> = {
    arguments: typicalAppConfig,
    parseOptions: {
        helpArg: 'help',
        headerContentSections: [
            {
                header: 'A typical app',
                content: 'Generates something {italic very} important.',
            },
        ],
        optionSections: [
            {
                header: 'Main options',
                group: ['main', 'input'],
            },
            {
                header: 'Misc',
                group: '_none',
            },
        ],
    },
};

export const exampleSections: UsageGuideConfig<ITypicalAppWithGroups> = {
    arguments: typicalAppConfig,
    parseOptions: {
        helpArg: 'help',
        headerContentSections: [
            {
                header: 'A typical app',
                content: 'Generates something {italic very} important.',
            },
            {
                header: 'Synopsis',
                content: [
                    '$ example [{bold --timeout} {underline ms}] {bold --src} {underline file} ...',
                    '$ example {bold --help}',
                ],
            },
        ],
        footerContentSections: [
            {
                header: 'Examples',
                content: [
                    {
                        Description: '1. A concise example. ',
                        Example: '$ example -t 100 lib/*.js',
                    },
                    {
                        Description: '2. A long example. ',
                        Example: '$ example --timeout 100 --src lib/*.js',
                    },
                    {
                        Description:
                            '3. This example will scan space for unknown things. Take cure when scanning space, it could take some time. ',
                        Example:
                            '$ example --src galaxy1.facts galaxy1.facts galaxy2.facts galaxy3.facts galaxy4.facts galaxy5.facts',
                    },
                ],
            },
            {
                content: 'Project home: {underline https://github.com/me/example}',
            },
        ],
    },
};

export const additionalModifiers: UsageGuideConfig<ITypicalAppWithGroups> = {
    arguments: typicalAppConfig,
    parseOptions: {
        helpArg: 'help',
        headerContentSections: [
            {
                header: 'Highlight Modifier',
                content: 'Some text that {highlight highlights} certain words',
            },
            {
                header: 'Code Modifier',
                content: [`Block of code: {code function logMessage(message: string) \\{console.log(message);\\}}`],
            },
            {
                header: 'Code With Language Modifier',
                content: [
                    `Block of code: {code.typescript function logMessage(message: string) \\{console.log(message);\\}}`,
                ],
            },
        ],
    },
};
