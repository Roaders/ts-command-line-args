import chalk from 'chalk';
import { IInsertCodeOptions } from '../contracts';
import { filterDoubleBlankLines, findEscapeSequence, splitContent } from './line-ending.helper';
import { isAbsolute, resolve } from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';

const asyncReadFile = promisify(readFile);

export async function insertCode(inputString: string, partialOptions?: Partial<IInsertCodeOptions>): Promise<string> {
    const options: IInsertCodeOptions = { removeDoubleBlankLines: false, ...partialOptions };

    const lineBreak = findEscapeSequence(inputString);
    let lines = splitContent(inputString);

    lines = await insertCodeImpl(lines, options, 0);

    if (options.removeDoubleBlankLines) {
        lines = lines.filter((line, index, lines) => filterDoubleBlankLines(line, index, lines));
    }

    return Promise.resolve(lines.join(lineBreak));
}

async function insertCodeImpl(lines: string[], options: IInsertCodeOptions, startLine: number): Promise<string[]> {
    const insertCodeBelow = options?.insertCodeBelow;
    const insertCodeAbove = options?.insertCodeAbove;

    if (insertCodeBelow == null) {
        return Promise.resolve(lines);
    }

    const insertCodeBelowResult = findIndex(lines, (line) => line.indexOf(insertCodeBelow) === 0, startLine);

    if (insertCodeBelowResult == null) {
        return Promise.resolve(lines);
    }

    const insertCodeAboveResult =
        insertCodeAbove != null
            ? findIndex(lines, (line) => line.indexOf(insertCodeAbove) === 0, insertCodeBelowResult.lineIndex)
            : undefined;

    const linesFromFile = await loadLines(options, insertCodeBelowResult);

    const linesBefore = lines.slice(0, insertCodeBelowResult.lineIndex + 1);
    const linesAfter = insertCodeAboveResult != null ? lines.slice(insertCodeAboveResult.lineIndex) : [];

    lines = [...linesBefore, ...linesFromFile, ...linesAfter];

    return insertCodeAboveResult == null ? lines : insertCodeImpl(lines, options, insertCodeAboveResult.lineIndex);
}

const fileRegExp = /file="([^"]+)"/;
const codeCommentRegExp = /codeComment(="([^"]+)")?/; //https://regex101.com/r/3MVdBO/1

async function loadLines(options: IInsertCodeOptions, result: FindLineResults): Promise<string[]> {
    const partialPathResult = fileRegExp.exec(result.line);

    if (partialPathResult == null) {
        console.error(
            `${chalk.red('ERROR: ')} insert code token (${
                options.insertCodeBelow
            }) found in file but file path not specified`,
        );
        console.log(`Please specify filepath as follows:`);
        console.log(`${options.insertCodeBelow} file="relativePath/from/markdown/toFile.whatever")`);
        process.exit(1);
    }

    const codeCommentResult = codeCommentRegExp.exec(result.line);

    const filePath = isAbsolute(partialPathResult[1])
        ? partialPathResult[1]
        : resolve(options.dirname || process.cwd(), partialPathResult[1]);

    const fileBuffer = await asyncReadFile(filePath);

    let contentLines = splitContent(fileBuffer.toString());

    const copyBelowMarker = options.copyCodeBelow;
    const copyAboveMarker = options.copyCodeAbove;

    const copyBelowIndex =
        copyBelowMarker != null ? contentLines.findIndex((line) => line.indexOf(copyBelowMarker) === 0) : -1;
    const copyAboveIndex =
        copyAboveMarker != null ? contentLines.findIndex((line) => line.indexOf(copyAboveMarker) === 0) : -1;

    if (copyAboveIndex > -1 && copyBelowIndex > -1 && copyAboveIndex < copyBelowIndex) {
        throw new Error(
            `The copyCodeAbove marker '${options.copyCodeAbove}' was found before the copyCodeBelow marker '${options.copyCodeBelow}'. The copyCodeBelow marked must be before the copyCodeAbove.`,
        );
    }

    contentLines = contentLines.slice(copyBelowIndex + 1, copyAboveIndex);

    if (codeCommentResult != null) {
        contentLines = ['```' + (codeCommentResult[2] ?? ''), ...contentLines, '```'];
    }

    return contentLines;
}

type FindLineResults = { line: string; lineIndex: number };

function findIndex(
    lines: string[],
    predicate: (line: string) => boolean,
    startLine: number,
): FindLineResults | undefined {
    for (let lineIndex = startLine; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        if (predicate(line)) {
            return { lineIndex, line };
        }
    }

    return undefined;
}
