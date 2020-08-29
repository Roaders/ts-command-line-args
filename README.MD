# ts-command-line-args

 > A thin Typescript wrapper around `command-line-args`

 ## Usage

 Take a typescript interface (or type or class):

 ```typescript
interface ICopyFilesArguments{
    sourcePath: string;
    targetPath: string;
    copyFiles: boolean;
    resetPermissions: boolean;
    filter?: string;
    excludePaths?: string[];
}
 ```

and use this to enforce the correct generation of options for `command-line-args`:

```typescript
import {parse} from 'ts-command-line-args';

// args typed as ICopyFilesArguments
export const args = parse<ICopyFilesArguments>({
    sourcePath: String,
    targetPath: String,
    copyFiles: { type: Boolean, alias: 'c' },
    resetPermissions: Boolean,
    filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
});
```

With the above setup these commands will all work

```bash
$ node exampleConfig.js --sourcePath=source --targetPath=target
$ node exampleConfig.js --sourcePath source --targetPath target --copyFiles
$ node exampleConfig.js --sourcePath source --targetPath target -c
$ node exampleConfig.js --sourcePath source --targetPath target --filter src --excludePaths=one --excludePaths=two
$ node exampleConfig.js --sourcePath source --targetPath target --filter src --excludePaths one two
```