import { parse } from '../parse';
import { typicalAppWithGroupsInfo } from './configs';

const args = parse(typicalAppWithGroupsInfo.arguments, typicalAppWithGroupsInfo.parseOptions);

console.log(`args: ${JSON.stringify(args)}`);
