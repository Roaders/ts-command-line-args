#!/usr/bin/env node

import { parse } from './parse';
import { IWriteMarkDown } from './contracts';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { addContent, generateUsageGuides } from './helpers';
import { argumentConfig, parseOptions } from './write-markdown.constants';

function writeMarkdown() {
    const args = parse<IWriteMarkDown>(argumentConfig, parseOptions);

    const markdownPath = resolve(args.markdownPath);

    console.log(`Loading existing file from '${markdownPath}'`);
    const markdownFileContent = readFileSync(markdownPath).toString();

    const usageGuides = generateUsageGuides(args);
    const modifiedFileContent = addContent(markdownFileContent, usageGuides, args);

    const action = args.verify === true ? `verify` : `write`;
    const contentMatch = markdownFileContent === modifiedFileContent ? `match` : `nonMatch`;

    switch (`${action}_${contentMatch}`) {
        case 'verify_match':
            console.log(`Markdown file as expected. No update required.`);
            break;
        case 'verify_nonMatch':
            throw new Error(`Markdown file out of date, update required.`);
        case 'write_match':
            console.log(`Content not modified, not writing to file.`);
            break;
        case 'write_nonMatch':
            console.log(`Writing file to '${markdownPath}'`);
            writeFileSync(markdownPath, modifiedFileContent);
            break;
    }
}

writeMarkdown();
