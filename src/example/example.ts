import { parse } from '../parse';
import { argumentConfig } from './exampleConfig';

const args = parse(argumentConfig);

console.log(`exampleConfig args: ${JSON.stringify(args)}`);
