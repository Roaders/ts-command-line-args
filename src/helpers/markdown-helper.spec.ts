import {
    usageGuideInfo as exampleConfigGuideInfo,
    ICopyFilesArguments,
    typicalAppWithGroupsInfo,
} from '../example/configs';
import { usageGuideInfo as writeMarkdownGuideInfo } from '../write-markdown.constants';
import { createUsageGuide } from './markdown-helper';
import { UsageGuideConfig } from '../contracts';

describe('markdown-helper', () => {
    it('should generate a simple usage guide with no additional sections and no alias column', () => {
        const info: UsageGuideConfig<ICopyFilesArguments> = {
            arguments: { ...exampleConfigGuideInfo.arguments, copyFiles: Boolean },
        };

        const usageGuide = createUsageGuide(info);

        expect(usageGuide).toEqual(`
## Options

| Argument | Type |
|-|-|
| **sourcePath** | string |
| **targetPath** | string |
| **copyFiles** | |
| **resetPermissions** | |
| **filter** | string |
| **excludePaths** | string[] |
`);
    });

    it('should generate a simple usage guide with no additional sections', () => {
        const usageGuide = createUsageGuide(exampleConfigGuideInfo);

        expect(usageGuide).toEqual(`
## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **sourcePath** | | string | |
| **targetPath** | | string | |
| **copyFiles** | **c** | **file[]** | **bold text** *italic text* ***bold italic text*** |
| **resetPermissions** | | | |
| **filter** | | string | |
| **excludePaths** | | string[] | |
`);
    });

    it('should generate a simple usage guide with sections', () => {
        const usageGuide = createUsageGuide(writeMarkdownGuideInfo);

        expect(usageGuide).toEqual(`
## write-markdown

Saves a command line usage guide to markdown.


### Write Markdown Command Line Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **markdownPath** | **m** | string | The file to write to. Without replacement markers the whole file content will be replaced. Path can be absolute or relative. |
| **replaceBelow** | | string | A marker in the file to replace text below. |
| **replaceAbove** | | string | A marker in the file to replace text above. |
| **jsFile** | **j** | string[] | jsFile to 'require' that has an export with the 'ArgumentConfig' export. |
| **configImportName** | **c** | string[] | Export name of the 'ArgumentConfig' object. Defaults to 'usageGuideInfo' |
| **help** | **h** | | |


### Default Markers

replaceBelow defaults to:  
\`'[//]: ####ts-command-line-args_write-markdown_replaceBelow  '\`  
replaceAbove defaults to:  
\`'[//]: ####ts-command-line-args_write-markdown_replaceAbove  '\`  
Note the double spaces at the end to signify to markdown that there should be a new line.
`);
    });

    it('should generate a usage guide with option groups', () => {
        const usageGuide = createUsageGuide(typicalAppWithGroupsInfo);

        expect(usageGuide).toEqual(`
# A typical app

Generates something *very* important.


## Main options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **help** | **h** | | Display this usage guide. |
| **src** | | file ... | The input files to process |
| **timeout** | **t** | ms | Timeout value in ms |


## Misc

| Argument | Type | Description |
|-|-|-|
| **plugin** | string | A plugin path |
`);
    });
});
