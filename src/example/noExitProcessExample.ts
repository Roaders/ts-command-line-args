import { argumentConfig } from './configs';
import { parse } from '../';

/**
 * will ignore missing errors and not exit
 * result typed as IMyExampleInterface | undefined
 */
const exampleArgumentsOrUndefined = parse(argumentConfig, {}, false);

console.log(`ParsedArguments:`);
console.log(JSON.stringify(exampleArgumentsOrUndefined, undefined, 2));
