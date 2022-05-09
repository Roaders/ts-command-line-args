import { IInsertCodeOptions } from '../contracts';
import {
    insertCodeBelowDefault,
    insertCodeAboveDefault,
    copyCodeBelowDefault,
    copyCodeAboveDefault,
} from '../write-markdown.constants';
import { insertCode } from './insert-code.helper';
import * as originalFs from 'fs';
import { any, IMocked, Mock, registerMock, reset, setupFunction } from '@morgan-stanley/ts-mocking-bird';
import { EOL } from 'os';
import { resolve } from 'path';

const beforeInsertionLine = `beforeInsertion`;
const afterInsertionLine = `afterInsertion`;

const insertLineOne = `insertLineOne`;
const insertLineTwo = `insertLineTwo`;

const insertBelowToken = `${insertCodeBelowDefault} file="someFile.ts" )`;

const sampleDirName = `sample/dirname`;

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('fs', () => require('@morgan-stanley/ts-mocking-bird').proxyJestModule(require.resolve('fs')));

describe(`(${insertCode.name}) insert-code.helper`, () => {
    let mockedFs: IMocked<typeof originalFs>;

    beforeEach(() => {
        mockedFs = Mock.create<typeof originalFs>().setup(
            setupFunction('readFile', ((_path: string, callback: (err: Error | null, data: Buffer) => void) => {
                callback(null, Buffer.from(`${insertLineOne}${EOL}${insertLineTwo}`));
            }) as any),
        );

        registerMock(originalFs, mockedFs.mock);
    });

    afterEach(() => {
        reset(originalFs);
    });

    function createOptions(partialOptions?: Partial<IInsertCodeOptions>): IInsertCodeOptions {
        return {
            insertCodeBelow: insertCodeBelowDefault,
            insertCodeAbove: insertCodeAboveDefault,
            copyCodeBelow: copyCodeBelowDefault,
            copyCodeAbove: copyCodeAboveDefault,
            dirname: sampleDirName,
            removeDoubleBlankLines: false,
            ...partialOptions,
        };
    }

    it(`should return original string when no insertBelow token provided`, async () => {
        const originalContent = [beforeInsertionLine, afterInsertionLine].join('\n');

        const result = await insertCode(
            originalContent,
            createOptions({ insertCodeAbove: undefined, insertCodeBelow: undefined }),
        );

        expect(result).toEqual(originalContent);
    });

    it(`should return original string when no insertBelow token found`, async () => {
        const originalContent = [beforeInsertionLine, afterInsertionLine].join('\n');

        const result = await insertCode(originalContent, createOptions());

        expect(result).toEqual(originalContent);
    });

    it(`should insert all file content with default tokens`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertLineOne,
            insertLineTwo,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should remove double blank lines if set to true`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertBelowToken,
            '',
            '',
            '',
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const result = await insertCode(originalContent, createOptions({ removeDoubleBlankLines: true }));

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertLineOne,
            insertLineTwo,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should insert all file content with custom tokens`, async () => {
        const originalContent = [
            beforeInsertionLine,
            `customInsertAfterToken file="somePath"`,
            `customInsertBeforeToken`,
            afterInsertionLine,
        ].join('\n');

        const result = await insertCode(
            originalContent,
            createOptions({ insertCodeBelow: `customInsertAfterToken`, insertCodeAbove: `customInsertBeforeToken` }),
        );

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'somePath'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            `customInsertAfterToken file="somePath"`,
            insertLineOne,
            insertLineTwo,
            `customInsertBeforeToken`,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should remove end of file if no insertAbove token`, async () => {
        const originalContent = [beforeInsertionLine, insertBelowToken, afterInsertionLine].join('\n');

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [beforeInsertionLine, insertBelowToken, insertLineOne, insertLineTwo].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should throw error if insertBelow token provided with no file`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertCodeBelowDefault,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        let error: Error | undefined;

        try {
            await insertCode(originalContent, createOptions());
        } catch (e) {
            error = e;
        }

        expect(error?.message).toEqual(
            `insert code token ([//]: # (ts-command-line-args_write-markdown_insertCodeBelow) found in file but file path not specified (file="relativePath/from/markdown/toFile.whatever")`,
        );
    });

    it(`should should only insert file content between copyAbove and copyBelow tokens`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const fileLines = ['randomFirstLine', copyCodeBelowDefault, insertLineOne, copyCodeAboveDefault, insertLineTwo];

        mockedFs.setupFunction('readFile', ((_path: string, callback: (err: Error | null, data: Buffer) => void) => {
            callback(null, Buffer.from(fileLines.join(EOL)));
        }) as any);

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertLineOne,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should should throw error if copyBelow and copyAbove are reversed`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const fileLines = ['randomFirstLine', copyCodeAboveDefault, insertLineOne, copyCodeBelowDefault, insertLineTwo];

        mockedFs.setupFunction('readFile', ((_path: string, callback: (err: Error | null, data: Buffer) => void) => {
            callback(null, Buffer.from(fileLines.join(EOL)));
        }) as any);

        let error: Error | undefined;

        try {
            await insertCode(originalContent, createOptions());
        } catch (e) {
            error = e;
        }

        expect(error?.message).toEqual(
            `The copyCodeAbove marker '// ts-command-line-args_write-markdown_copyCodeAbove' was found before the copyCodeBelow marker '// ts-command-line-args_write-markdown_copyCodeBelow'. The copyCodeBelow marked must be before the copyCodeAbove.`,
        );
    });

    it(`should should only insert file content after copyBelow token`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const fileLines = [insertLineOne, copyCodeBelowDefault, insertLineTwo];

        mockedFs.setupFunction('readFile', ((_path: string, callback: (err: Error | null, data: Buffer) => void) => {
            callback(null, Buffer.from(fileLines.join(EOL)));
        }) as any);

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertLineTwo,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should should only insert file content above copyAbove token`, async () => {
        const originalContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const fileLines = [insertLineOne, copyCodeAboveDefault, insertLineTwo];

        mockedFs.setupFunction('readFile', ((_path: string, callback: (err: Error | null, data: Buffer) => void) => {
            callback(null, Buffer.from(fileLines.join(EOL)));
        }) as any);

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            insertBelowToken,
            insertLineOne,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should insert a code comment`, async () => {
        const originalContent = [
            beforeInsertionLine,
            `${insertCodeBelowDefault} file="someFile.ts" codeComment )`,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            `${insertCodeBelowDefault} file="someFile.ts" codeComment )`,
            '```',
            insertLineOne,
            insertLineTwo,
            '```',
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });

    it(`should insert a name code comment`, async () => {
        const originalContent = [
            beforeInsertionLine,
            `${insertCodeBelowDefault} file="someFile.ts" codeComment="ts" )`,
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        const result = await insertCode(originalContent, createOptions());

        expect(
            mockedFs.withFunction('readFile').withParameters(resolve(sampleDirName, 'someFile.ts'), any()),
        ).wasCalledOnce();

        const expectedContent = [
            beforeInsertionLine,
            `${insertCodeBelowDefault} file="someFile.ts" codeComment="ts" )`,
            '```ts',
            insertLineOne,
            insertLineTwo,
            '```',
            insertCodeAboveDefault,
            afterInsertionLine,
        ].join('\n');

        expect(result).toEqual(expectedContent);
    });
});
