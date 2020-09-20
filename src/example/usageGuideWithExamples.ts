import { parse } from '../parse';
import { exampleSections } from './configs';

const args = parse(exampleSections.arguments, exampleSections.parseOptions);

console.log(`args: ${JSON.stringify(args)}`);
