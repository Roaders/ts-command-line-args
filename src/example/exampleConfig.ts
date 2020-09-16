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
