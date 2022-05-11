# Code inserted from file:

[//]: # (ts-command-line-args_write-markdown_insertCodeBelow file="./insert-code.example.ts" codeComment="ts")
```ts
async function insertSampleCode() {
    // this function is inserted into markdown from a ts file using insertCode
    await insertCode('src/example/insert-code-sample.md', {
        insertCodeBelow: insertCodeBelowDefault,
        insertCodeAbove: insertCodeAboveDefault,
        copyCodeBelow: copyCodeBelowDefault,
        copyCodeAbove: copyCodeAboveDefault,
    });
}
```
[//]: # (ts-command-line-args_write-markdown_insertCodeAbove)

The above code was inserted using `ts-command-line-args`