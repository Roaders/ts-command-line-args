import { parse } from '../parse';
import { argumentConfig } from './configs';

const args = parse(argumentConfig, { hideMissingArgMessages: true }, false);

if (args._commandLineResults.missingArgs.length > 0) {
    args._commandLineResults.printHelp();
} else {
    console.log(`exampleConfig args: ${JSON.stringify(args)}`);
}
