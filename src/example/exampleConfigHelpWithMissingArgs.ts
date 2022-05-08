import { parse, CommandLineOption } from '../';
import { argumentConfig } from './configs';

const args = parse(argumentConfig, {
    showHelpWhenArgsMissing: true,
    helpWhenArgMissingHeader: (missingArgs: CommandLineOption[]) => ({
        header: 'Missing Arguments',
        content: `The arguments [${missingArgs
            .map((arg) => arg.name)
            .join(', ')}] were not supplied. Please see help below:`,
    }),
});

console.log(`exampleConfig args: ${JSON.stringify(args)}`);
