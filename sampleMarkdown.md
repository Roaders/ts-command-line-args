# Sample Markdown

Content Before Usage Guide

[//]: ####ts-command-line-args_write-markdown_replaceBelow  

## write-markdown

Saves a command line usage guide to markdown.


### Write Markdown Command Line Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **markdownPath** | **m** | string | The file to write to. Without replacement markers the whole file content will be replaced. Path can be absolute or relative. |
| **replaceBelow** | | string | A marker in the file to replace text below. |
| **replaceAbove** | | string | A marker in the file to replace text above. |
| **jsFile** | **j** | string[] | jsFile to 'require' that has an export with the 'ArgumentConfig' export. |
| **configImportName** | | string[] | Export name of the 'ArgumentConfig' object. Defaults to 'usageGuideInfo' |
| **help** | **h** | | |


### Default Markers

replaceBelow defaults to:  
`'[//]: ####ts-command-line-args_write-markdown_replaceBelow  '`  
replaceAbove defaults to:  
`'[//]: ####ts-command-line-args_write-markdown_replaceAbove  '`  
Note the double spaces at the end to signify to markdown that there should be a new line.


## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **sourcePath** | | string | |
| **targetPath** | | string | |
| **copyFiles** | **c** | **file[]** | **bold text** *italic text* ***bold italic text*** |
| **resetPermissions** | | | |
| **filter** | | string | |
| **excludePaths** | | string[] | |

[//]: ####ts-command-line-args_write-markdown_replaceAbove  

Content after usage guide
