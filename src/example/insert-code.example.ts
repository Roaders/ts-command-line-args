import { insertCode } from '../';
import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import {
    copyCodeAboveDefault,
    copyCodeBelowDefault,
    insertCodeAboveDefault,
    insertCodeBelowDefault,
} from '../write-markdown.constants';

// ts-command-line-args_write-markdown_copyCodeBelow
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
// ts-command-line-args_write-markdown_copyCodeAbove

insertSampleCode();
