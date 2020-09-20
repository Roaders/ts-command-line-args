import { parse } from '../parse';
import { additionalModifiers } from './configs';

const args = parse(additionalModifiers.arguments, additionalModifiers.parseOptions);

console.log(`args: ${JSON.stringify(args)}`);
