import { parse } from '../parse';
import { argumentConfig } from './configs';

/**
 * adds unknown arguments to _unknown property and does not throw for unknowns
 * result typed as IMyExampleInterface & { _unknown: string[] }
 */
const exampleArgumentsWithUnknown = parse(argumentConfig, { partial: true });

console.log(`Unknown Arguments:`);
console.log(JSON.stringify(exampleArgumentsWithUnknown._unknown, undefined, 2));
