import { ArgumentConfig } from './contracts';
import { createCommandLineConfig } from './parse';

describe('parse', () => {
    describe('createCommandLineConfig', () => {
        it('should create expected config', () => {
            interface ComplexProperties {
                requiredStringOne: string;
                requiredStringTwo: string;
                optionalString?: string;
                nullableString: string | null;
                optionalNullableString?: string | null;
                requiredArray: string[];
                optionalArray?: string[];
            }

            const argumentConfig: ArgumentConfig<ComplexProperties> = {
                requiredStringOne: String,
                requiredStringTwo: { type: String, defaultValue: 'default' },
                optionalString: { type: String, optional: true, alias: 'o' },
                nullableString: { type: String, nullable: true },
                optionalNullableString: { type: String, nullable: true, optional: true },
                requiredArray: { type: String, multiple: true },
                optionalArray: { type: String, lazyMultiple: true, optional: true },
            };

            const commandLineConfig = createCommandLineConfig(argumentConfig);

            expect(commandLineConfig).toEqual([
                { name: 'requiredStringOne', type: String },
                { name: 'requiredStringTwo', type: String, defaultValue: 'default' },
                { name: 'optionalString', type: String, optional: true, alias: 'o' },
                { name: 'nullableString', type: String, nullable: true },
                { name: 'optionalNullableString', type: String, nullable: true, optional: true },
                { name: 'requiredArray', type: String, multiple: true },
                { name: 'optionalArray', type: String, lazyMultiple: true, optional: true },
            ]);
        });
    });
});
