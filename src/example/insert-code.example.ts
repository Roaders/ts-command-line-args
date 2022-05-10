import { insertCode } from '../';
import {
    copyCodeAboveDefault,
    copyCodeBelowDefault,
    insertCodeAboveDefault,
    insertCodeBelowDefault,
} from '../write-markdown.constants';

// ts-command-line-args_write-markdown_copyCodeBelow
async function insertSampleCode() {
    // this function is inserted into markdown from a ts file using insertCode
    await insertCode('src/example/insert-code-sample.md', {
        insertCodeBelow: insertCodeBelowDefault,
        insertCodeAbove: insertCodeAboveDefault,
        copyCodeBelow: copyCodeBelowDefault,
        copyCodeAbove: copyCodeAboveDefault,
    });
}
// ts-command-line-args_write-markdown_copyCodeAbove

insertSampleCode();
