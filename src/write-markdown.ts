#!/usr/bin/env node

import { parse } from './parse';
import { ArgumentConfig, ParseOptions, IWriteMarkDown } from './contracts';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { addContent } from './helpers';

export const replaceBelowDefault = `####ts-command-line-args_write-markdown_replaceBelow`;
export const replaceAboveDefault = `####ts-command-line-args_write-markdown_replaceAbove`;
export const configImportNameDefault = `argumentConfig`;
export const optionsImportNameDefault = `parseOptions`;

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
        description: `A marker in the file to replace text below. Defaults to:\n'${replaceBelowDefault}'`,
    },
    replaceAbove: {
        type: String,
        defaultValue: replaceAboveDefault,
        description: `A marker in the file to replace text above. Defaults to:\n'${replaceAboveDefault}'`,
    },
    jsFile: {
        type: String,
        alias: 'j',
        description: `jsFile to 'require' that has an export with the 'ArgumentConfig' export.`,
    },
    configImportName: {
        type: String,
        defaultValue: configImportNameDefault,
        description: `Export name of the 'ArgumentConfig' object. Defaults to '${configImportNameDefault}'`,
    },
    optionsImportName: {
        type: String,
        defaultValue: optionsImportNameDefault,
        description: `Export name of the 'ParseOptions' object. Defaults to '${optionsImportNameDefault}'`,
    },
    help: { type: Boolean, alias: 'h' },
};

export const parseOptions: ParseOptions<IWriteMarkDown> = {
    helpArg: 'help',
    baseCommand: `write-markdown`,
    headerContentSections: [{ header: 'write-markdown', content: `Saves a command line usage guide to markdown.` }],
};

function writeMarkdown() {
    const args = parse<IWriteMarkDown>(argumentConfig, parseOptions);

    const markdownPath = resolve(args.markdownPath);

    console.log(`Loading existing file from '${markdownPath}'`);
    let markdownFileContent = readFileSync(markdownPath).toString();

    markdownFileContent = addContent(markdownFileContent, `NEW CONTENT`, args);

    console.log(`Writing file to '${markdownPath}'`);
    writeFileSync(markdownPath, markdownFileContent);
}

writeMarkdown();
