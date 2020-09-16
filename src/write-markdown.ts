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

    if (markdownFileContent !== modifiedFileContent) {
        console.log(`Writing file to '${markdownPath}'`);
        writeFileSync(markdownPath, modifiedFileContent);
    } else {
        console.log(`Content not modified, not writing to file.`);
    }
}

writeMarkdown();
