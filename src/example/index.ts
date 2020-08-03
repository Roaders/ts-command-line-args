/* eslint-disable @typescript-eslint/no-unused-vars */

import { ArgumentConfig } from "../contracts";
import { parse } from "../parse";

interface IMyExampleInterface{
    requiredString: string;
    optionalString?: string;
    nullableString: string | null;
    optionalNullableString?: string | null
    requiredArray: string[];
    optionalArray?: string[];
}

const argumentConfig: ArgumentConfig<IMyExampleInterface> = {
    requiredString: String,
    optionalString: {type: String, optional: true},
    nullableString: {type: String, nullable: true},
    optionalNullableString: {type: String, nullable: true, optional: true},
    requiredArray: {type: String, multiple: true},
    optionalArray: {type: String, multiple: true, optional: true}

};

/**
 * will log errors if there are any missing properties then call process.exit()
 * result typed as IMyExampleInterface
 */
const exampleArguments = parse(argumentConfig);

/**
 * will ignore missing errors and not exit
 * result typed as IMyExampleInterface | undefined
 */
const exampleArgumentsOrUndefined = parse(argumentConfig, false);
const passOptionsExampleArgumentsOrUndefined = parse(argumentConfig, {}, false);

/**
 * adds unknown arguments to _unknown property and does not throw for unknowns
 * result typed as IMyExampleInterface & { _unknown: string[] }
 */
const exampleArgumentsWithUnknownExitProcess = parse(argumentConfig, {partial: true}, false);
const exampleArgumentsWithUnknown = parse(argumentConfig, {partial: true});

/**
 * adds unknown arguments to _unknown property and stop processing properties when first unknown reached
 * result typed as IMyExampleInterface & { _unknown: string[] }
 */
const exampleArgumentsWithStopExitProcess = parse(argumentConfig, {partial: true}, false);
const exampleArgumentsWithStop = parse(argumentConfig, {partial: true});