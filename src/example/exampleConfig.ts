import { ArgumentConfig } from '../contracts';
import { parse } from '../parse';

interface ICopyFilesArguments {
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
    copyFiles: { type: Boolean, alias: 'c' },
    resetPermissions: Boolean,
    filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
};

export const args = parse(argumentConfig);

console.log(`args: ${JSON.stringify(args)}`);
