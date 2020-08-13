import { ArgumentConfig } from '../contracts';

interface IMyExampleInterface {
    requiredString: string;
    optionalString?: string;
    requiredArray: string[];
    optionalArray?: string[];
}

export const argumentConfig: ArgumentConfig<IMyExampleInterface> = {
    requiredString: String,
    optionalString: { type: String, optional: true },
    requiredArray: { type: String, multiple: true },
    optionalArray: { type: String, multiple: true, optional: true },
};
