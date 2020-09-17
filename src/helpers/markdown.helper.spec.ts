/* eslint-disable no-useless-escape */
import {
    usageGuideInfo as exampleConfigGuideInfo,
    ICopyFilesArguments,
    typicalAppWithGroupsInfo,
    exampleSections,
} from '../example/configs';
import { usageGuideInfo as writeMarkdownGuideInfo } from '../write-markdown.constants';
import { createUsageGuide } from './markdown.helper';
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


### Default Replacement Markers

replaceBelow defaults to:  
\`'[//]: ####ts-command-line-args_write-markdown_replaceBelow  '\`  
replaceAbove defaults to:  
\`'[//]: ####ts-command-line-args_write-markdown_replaceAbove  '\`  
Note the double spaces at the end to signify to markdown that there should be a new line.


### String Formatting

The only chalk modifiers supported when converting to markdown are \`bold\` and \`italic\`.  
For example:  
{bold bold text} {italic italic text} {italic.bold bold italic text}  
will be converted to:  
\\*\\*boldText\\*\\* \\*italic text\\* \\*\\*\\*bold italic text\\*\\*\\*


#### Additional Modifiers

Two additional style modifiers have been added that are supported when writing markdown. They are removed when printing to the console.  
  
{highlight someText}  
surrounds the text in backticks:  
\`someText\`  
and   
{code someText}  
Surrounds the text in triple back ticks:  
\`\`\`  
someText  
\`\`\`
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

    it('should generate a usage guide with table of examples', () => {
        const usageGuide = createUsageGuide(exampleSections);

        expect(usageGuide).toEqual(`
# A typical app

Generates something *very* important.


# Synopsis

$ example [**--timeout** ms] **--src** file ...
$ example **--help**


## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **help** | **h** | | Display this usage guide. |
| **src** | | file ... | The input files to process |
| **timeout** | **t** | ms | Timeout value in ms |
| **plugin** | | string | A plugin path |


# Examples


| Description | Example |
|-|-|
| 1. A concise example.  | $ example -t 100 lib/*.js |
| 2. A long example.  | $ example --timeout 100 --src lib/*.js |
| 3. This example will scan space for unknown things. Take cure when scanning space, it could take some time.  | $ example --src galaxy1.facts galaxy1.facts galaxy2.facts galaxy3.facts galaxy4.facts galaxy5.facts |



Project home: https://github.com/me/example
`);
    });
});
