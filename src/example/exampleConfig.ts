import { parse } from '../parse';
import { argumentConfig } from './configs';

const args = parse(argumentConfig);

console.log(`exampleConfig args: ${JSON.stringify(args)}`);
