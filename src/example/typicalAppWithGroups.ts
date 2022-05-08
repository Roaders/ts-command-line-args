import { parse } from '../';
import { typicalAppWithGroupsInfo } from './configs';

const args = parse(typicalAppWithGroupsInfo.arguments, typicalAppWithGroupsInfo.parseOptions);

console.log(`args: ${JSON.stringify(args)}`);
