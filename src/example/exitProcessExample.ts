import { parse } from '../parse';
import { argumentConfig } from './configs';

/**
 * will log errors if there are any missing properties then call process.exit()
 * result typed as IMyExampleInterface
 */
const exampleArguments = parse(argumentConfig);

console.log(`ParsedArguments:`);
console.log(JSON.stringify(exampleArguments, undefined, 2));
