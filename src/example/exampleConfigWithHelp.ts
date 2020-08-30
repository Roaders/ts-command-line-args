import { parse } from '../parse';

interface ICopyFilesArguments {
    sourcePath: string;
    targetPath: string;
    copyFiles: boolean;
    resetPermissions: boolean;
    filter?: string;
    excludePaths?: string[];
    help?: boolean;
}

export const args = parse<ICopyFilesArguments>(
    {
        sourcePath: String,
        targetPath: String,
        copyFiles: { type: Boolean, alias: 'c' },
        resetPermissions: Boolean,
        filter: { type: String, optional: true },
        excludePaths: { type: String, multiple: true, optional: true },
        help: { type: Boolean, optional: true },
    },
    {},
);

console.log(`args: ${JSON.stringify(args)}`);
