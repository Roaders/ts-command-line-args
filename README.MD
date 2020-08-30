# ts-command-line-args

 > A thin Typescript wrapper around [`command-line-args`](https://www.npmjs.com/package/command-line-args)

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

### Usage Guide Generation

[`command-line-usage`](https://github.com/75lb/command-line-usage) support is included:

```typescript
import { parse } from 'ts-command-line-args';

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
```

with the above config these commands:

```bash
$ node exampleConfigWithHelp.js -h
$ node exampleConfigWithHelp.js --help
```
will give the following output:

```
My Example Config

  Thanks for using Our Awesome Library

Options

  --sourcePath string
  --targetPath string
  -c, --copyFiles           Copies files rather than moves them
  --resetPermissions
  --filter string
  --excludePaths string[]
  -h, --help                Prints this usage guide

Footer

  Copyright: Big Faceless Corp. inc.
```
## Documentation

This library is a thin wrapper around [`command-line-args`](https://www.npmjs.com/package/command-line-args) so any docs or options for that library should apply to this library as well.

### Parse

```typescript
function parse<T>(config: ArgumentConfig<T>, options: ParseOptions = {}, exitProcess = true): T
```

`parse` will return an object containing all of your command line options. For example with this config:
```typescript
import {parse} from 'ts-command-line-args';

export const args = parse<ICopyFilesArguments>({
    sourcePath: String,
    targetPath: { type: String, alias: 't' },
    copyFiles: { type: Boolean, alias: 'c' },
    resetPermissions: Boolean,
    filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
});
```
and this command:
```bash
$ node exampleConfig.js --sourcePath mySource --targetPath myTarget
```
the following object will be returned: 
```javascript
{
    "sourcePath":"mySource",
    "targetPath":"myTarget",
    "copyFiles":false,
    "resetPermissions":false
}
```
(booleans are defaulted to false unless they are marked as `optional`)

If any required options are omitted (in this case just `sourcePath` and `targetPath`) then an error message will be logged and the process will exit with no further code will be executed after the call to `parse`:

```bash
$ node exampleConfigWithHelp.js
Required parameter 'sourcePath' was not passed. Please provide a value by passing '--sourcePath=passedValue' in command line arguments
Required parameter 'targetPath' was not passed. Please provide a value by passing '--targetPath=passedValue' or '-t passedValue' in command line arguments
```

If you do not want the process to exit that this can be disabled by passing false as the last argument:

```typescript
import {parse} from 'ts-command-line-args';

export const args = parse<ICopyFilesArguments>({
    sourcePath: String,
    targetPath: { type: String, alias: 't' },
    copyFiles: { type: Boolean, alias: 'c' },
    resetPermissions: Boolean,
    filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
},
{}, // empty options object
false
);
```
In this case errors will still be logged to the console but the process will not exit and code execution will continue after the call to `parse`.

### Option Definitions

Option definitions must be passed to `parse`. For the most part option definitions are the same as [`OptionDefinition`](https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md) from `command-line-args` except that `name` is not required. Name is not required as we pass an object:

```typescript
{
    propertyName: {}
}
```
rather than an array of options:
```typescript
[
    { name: "propertyName" }
]
```

#### Simple Arguments

For a simple, single, required argument you only need to define the `type`:

```typescript
parse<IMyInterface>({
    stringArg: String, 
    numberArg: Number,
    });
```

the `type` can be any function with the signature `(value?: string) => T | undefined`. The javascript provided functions `String`, `Number` and `Boolean` all do this for simple data types but a function could be written to convert a passed in string value to a `Date` for example:

```typescript
function parseDate(value?: string) {
    return value ? new Date(Date.parse(value)) : undefined;
}

parse<IMyInterface>({ myDate: parseDate });
```

A similar function could be written for any complex type.

#### Further Configuration

For anything other than a single, required, simple argument a configuration object must be defined for each argument. This call:

```typescript
parse<IMyInterface>({
    stringArg: String, 
    numberArg: Number
    });
```

and this:

```typescript
parse<IMyInterface>({
    stringArg: { type: String }, 
    numberArg: { type: Number },
    });
```

are identical.

**Optional Arguments**

If an argument is optional it must be defined as such to avoid console errors being logged and the process exiting when `parse` is called.

This interface:

```typescript
{
    requiredArg: string,
    optionalArg?: string,
}
```
defines `optionalArg` as optional. This must be reflected in the config passed to `parse`:

```typescript
parse<IMyInterface>({
    requiredArg: String, 
    requiredArg: { type: String, optional: true },
    });
```

Typescript compilation will fail in the above case without `optional: true` being added.

**Multiple Values**

If multiple values can be passed then the argument should be defined as an array:

```typescript
{
    users: string[],
}
```

and it must defined as `multiple` in the config:

```typescript
parse<IMyInterface>({
    users: {requiredArg: Number, multiple: true},
    });
```

Typescript compilation will fail in the above case without `multiple: true` being added.

Multiple values can be passed on the command line as follows:

```bash
$ node myApp.js users=Jeoff users=Frank users=Dave
$ node myApp.js users Jeoff users Frank users Dave
$ node myApp.js users=Jeoff Frank Dave
$ node myApp.js users Jeoff Frank Dave
```

For further Option Definition documentation refer to [these docs](https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md).

### Options

Most of the available options are the same as the options defined by [`command-line-args`](https://www.npmjs.com/package/command-line-args): https://github.com/75lb/command-line-args/blob/master/doc/API.md. 

A few additional options have been added:

**logger** - used for logging errors or help guide to the console. Defaults to `console.log` and `console.error`.

**helpArg** - used to defined the argument used to generate the usage guide. This is expected to be boolean but the comparison is not strict so any argument type / value that is resolved as truthy will work.

**headerContentSections** / **footerContentSections** - optional help sections that will appear before / after the `Options` section that is generated from the option config. In most cases you should probably include one header section that explains what the application does.