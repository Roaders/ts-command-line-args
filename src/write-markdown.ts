#!/usr/bin/env node

import { parse } from './parse';

interface IWriteMarkDown {
    outputFile: string;
    replaceBelow: string;
    replaceAbove: string;
    jsFile: string;
    importName: string;
    help: boolean;
}

export const replaceBelowDefault = `####ts-command-line-args_write-markdown_replaceBelow`;
export const replaceAboveDefault = `####ts-command-line-args_write-markdown_replaceAbove`;
export const importNameDefault = `argumentConfig`;

const args = parse<IWriteMarkDown>(
    {
        outputFile: {
            type: String,
            alias: 'o',
            description: 'The file to write to. Without replacement markers the whole file content will be replaced.',
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
            description: `jsFile to 'require' that has an export with the 'ArgumentConfig' object`,
        },
        importName: {
            type: String,
            defaultValue: importNameDefault,
            description: `Export name of the 'ArgumentConfig' object. Defaults to '${importNameDefault}'`,
        },
        help: { type: Boolean, alias: 'h' },
    },
    { helpArg: 'help' },
);

console.log(args);
