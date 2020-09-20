import { createCommandLineConfig, normaliseConfig } from './command-line.helper';
import { ArgumentConfig } from '../contracts';

describe('command-line.helper', () => {
    interface ComplexProperties {
        requiredStringOne: string;
        requiredStringTwo: string;
        optionalString?: string;
        requiredArray: string[];
        optionalArray?: string[];
    }

    function getConfig(): ArgumentConfig<ComplexProperties> {
        return {
            requiredStringOne: String,
            requiredStringTwo: { type: String },
            optionalString: { type: String, optional: true },
            requiredArray: { type: String, multiple: true },
            optionalArray: { type: String, lazyMultiple: true, optional: true },
        };
    }

    describe('normaliseConfig', () => {
        it('should replace type constructors with objects', () => {
            const normalised = normaliseConfig(getConfig());

            expect(normalised).toEqual({
                requiredStringOne: { type: String },
                requiredStringTwo: { type: String },
                optionalString: { type: String, optional: true },
                requiredArray: { type: String, multiple: true },
                optionalArray: { type: String, lazyMultiple: true, optional: true },
            });
        });
    });

    describe('createCommandLineConfig', () => {
        it('should create expected config', () => {
            const commandLineConfig = createCommandLineConfig(normaliseConfig(getConfig()));

            expect(commandLineConfig).toEqual([
                { name: 'requiredStringOne', type: String },
                { name: 'requiredStringTwo', type: String },
                { name: 'optionalString', type: String, optional: true },
                { name: 'requiredArray', type: String, multiple: true },
                { name: 'optionalArray', type: String, lazyMultiple: true, optional: true },
            ]);
        });
    });
});
