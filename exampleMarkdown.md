# write-markdown

Saves a command line usage guide to markdown. 

## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **markdownPath** | **m** | string | The file to write to. Without replacement markers the whole file content will be replaced. Path can be absolute or relative. |
| **replaceBelow** | | string | A marker in the file to replace text below. Defaults to: '[\/\/]: ####ts-command-line-args_write-markdown_replaceBelow' |
| **replaceAbove** | | string | A marker in the file to replace text above. Defaults to: '[\/\/]: ####ts-command-line-args_write-markdown_replaceAbove' |
| **jsFile** | **j** | string[] | jsFile to 'require' that has an export with the 'ArgumentConfig' export. |
| **configImportName** | | string[] | Export name of the 'ArgumentConfig' object. Defaults to 'usageGuideInfo' |
| **help** | **h**  |


## Options

| Argument | Type |
|-|-|
| **sourcePath** | string |
| **targetPath** | string |
| **copyFiles** | string |
| **resetPermissions** |
| **filter** | string |
| **excludePaths** | string[] |

## Options

| Argument | Alias | Type |
|-|-|-|
| **sourcePath** | | string |
| **targetPath** | | string |
| **copyFiles** | **c** | string |
| **resetPermissions** | |
| **filter** | | string |
| **excludePaths** | | string[] |