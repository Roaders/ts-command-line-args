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
        copyFiles: { type: Boolean, alias: 'c', description: 'Copies files rather than moves them' },
        resetPermissions: Boolean,
        filter: { type: String, optional: true },
        excludePaths: { type: String, multiple: true, optional: true },
        help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
    },
    {
        helpArg: 'help',
        headerContentSections: [{ header: 'My Example Config', content: 'Thanks for using Our Awesome Library' }],
        footerContentSections: [{ header: 'Footer', content: `Copyright: Big Faceless Corp. inc.` }],
    },
);

console.log(`args: ${JSON.stringify(args)}`);
