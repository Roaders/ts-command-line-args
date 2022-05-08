# Code inserted from file:

[//]: # (ts-command-line-args_write-markdown_insertCodeBelow file="./insert-code.example.ts" codeComment="ts")
```ts
async function insertSampleCode() {
    const fileContent = readFileSync('src/example/insert-code-sample.md').toString();

    const newContent = await insertCode(fileContent, {
        insertCodeBelow: insertCodeBelowDefault,
        insertCodeAbove: insertCodeAboveDefault,
        copyCodeBelow: copyCodeBelowDefault,
        copyCodeAbove: copyCodeAboveDefault,
        dirname: dirname(`src/example/insert-code-sample.md`),
    });

    writeFileSync('src/example/insert-code-sample.md', newContent);
}
```
[//]: # (ts-command-line-args_write-markdown_insertCodeAbove)

The above code was inserted using `ts-command-line-args`