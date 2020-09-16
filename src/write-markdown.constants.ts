import { ArgumentConfig, IWriteMarkDown, ParseOptions, UsageGuideConfig } from './contracts';

export const replaceBelowDefault = `[//]: ####ts-command-line-args_write-markdown_replaceBelow  `;
export const replaceAboveDefault = `[//]: ####ts-command-line-args_write-markdown_replaceAbove  `;
export const configImportNameDefault = `usageGuideInfo`;

export const argumentConfig: ArgumentConfig<IWriteMarkDown> = {
    markdownPath: {
        type: String,
        alias: 'm',
        description:
            'The file to write to. Without replacement markers the whole file content will be replaced. Path can be absolute or relative.',
    },
    replaceBelow: {
        type: String,
        defaultValue: replaceBelowDefault,
        description: `A marker in the file to replace text below.`,
    },
    replaceAbove: {
        type: String,
        defaultValue: replaceAboveDefault,
        description: `A marker in the file to replace text above.`,
    },
    jsFile: {
        type: String,
        alias: 'j',
        description: `jsFile to 'require' that has an export with the 'ArgumentConfig' export.`,
        multiple: true,
    },
    configImportName: {
        type: String,
        alias: 'c',
        defaultValue: [configImportNameDefault],
        description: `Export name of the 'ArgumentConfig' object. Defaults to '${configImportNameDefault}'`,
        multiple: true,
    },
    help: { type: Boolean, alias: 'h' },
};

export const parseOptions: ParseOptions<IWriteMarkDown> = {
    helpArg: 'help',
    baseCommand: `write-markdown`,
    optionsHeaderLevel: 3,
    optionsHeaderText: `Write Markdown Command Line Options`,
    headerContentSections: [
        { header: 'write-markdown', headerLevel: 2, content: `Saves a command line usage guide to markdown.` },
    ],
    footerContentSections: [
        {
            header: 'Default Markers',
            headerLevel: 3,
            content: `replaceBelow defaults to:
\`'${replaceBelowDefault}'\`
replaceAbove defaults to:
\`'${replaceAboveDefault}'\`
Note the double spaces at the end to signify to markdown that there should be a new line.`,
        },
    ],
};

export const usageGuideInfo: UsageGuideConfig<IWriteMarkDown> = {
    arguments: argumentConfig,
    parseOptions,
};
