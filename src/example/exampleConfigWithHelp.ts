import { parse } from '../parse';

interface ICopyFilesArguments {
    sourcePath: string;
    targetPath: string;
    copyFiles: boolean;
    resetPermissions: boolean;
    filter?: string;
    excludePaths?: string[];
    help?: boolean;
    configFile?: string;
    configPath?: string;
}

export const args = parse<ICopyFilesArguments>(
    {
        sourcePath: String,
        targetPath: String,
        copyFiles: {
            type: Boolean,
            alias: 'c',
            typeLabel: `{underline file[]}`,
            description: `{bold bold text} {italic italic text} {italic.bold bold italic text}`,
        },
        resetPermissions: Boolean,
        filter: { type: String, optional: true },
        excludePaths: { type: String, multiple: true, optional: true },
        help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
        configFile: { type: String, optional: true },
        configPath: { type: String, optional: true },
    },
    {
        helpArg: 'help',
        baseCommand: 'node exampleConfigWithHelp',
        headerContentSections: [{ header: 'My Example Config', content: 'Thanks for using Our Awesome Library' }],
        footerContentSections: [{ header: 'Footer', content: `Copyright: Big Faceless Corp. inc.` }],
        loadFromFileArg: 'configFile',
        loadFromFileJsonPathArg: 'configPath',
    },
);

console.log(`args: ${JSON.stringify(args)}`);
