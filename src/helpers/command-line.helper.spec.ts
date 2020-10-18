import { createCommandLineConfig, mergeConfig, normaliseConfig } from './command-line.helper';
import { ArgumentConfig, ArgumentOptions } from '../contracts';

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

    describe('mergeConfig', () => {
        interface ISampleInterface {
            stringOne: string;
            stringTwo: string;
            strings: string[];
            number: number;
            boolean: boolean;
            dates: Date[];
            configPath?: string;
        }

        let options: ArgumentOptions<ISampleInterface>;

        beforeEach(() => {
            options = {
                stringOne: { type: String },
                stringTwo: { type: String },
                strings: { type: String, multiple: true },
                number: { type: Number },
                boolean: { type: Boolean },
                dates: { type: (value) => new Date(Date.parse(value)), multiple: true },
                configPath: { type: String, optional: true },
            };
        });

        it('should return configFromFile untouched if no parsed args', () => {
            const configfromFile: Partial<Record<keyof ISampleInterface, any>> = {
                stringOne: 'stringOneFromFile',
                stringTwo: 'stringTwoFromFile',
            };
            const result = mergeConfig<ISampleInterface>({}, configfromFile, options);

            expect(result).toEqual(configfromFile);
        });

        it('should return configFromFile when filePathSet', () => {
            const configfromFile: Partial<Record<keyof ISampleInterface, any>> = {
                stringOne: 'stringOneFromFile',
                stringTwo: 'stringTwoFromFile',
            };
            const fileContent = {
                configs: {
                    cmdLineConfig: {
                        example: configfromFile,
                    },
                },
            };
            const parsedArgs: Partial<ISampleInterface> = {
                configPath: 'configs.cmdLineConfig.example',
            };
            const result = mergeConfig<ISampleInterface>(parsedArgs, fileContent, options, 'configPath');

            expect(result).toEqual({ ...configfromFile, ...parsedArgs });
        });

        type ConversionTest = {
            fromFile: Partial<Record<keyof ISampleInterface, any>>;
            expected: Partial<ISampleInterface>;
        };

        const typeConversionTests: ConversionTest[] = [
            { fromFile: { stringOne: 'stringOne' }, expected: { stringOne: 'stringOne' } },
            { fromFile: { strings: 'stringOne' }, expected: { strings: ['stringOne'] } },
            { fromFile: { strings: ['stringOne', 'stringTwo'] }, expected: { strings: ['stringOne', 'stringTwo'] } },
            { fromFile: { number: '1' }, expected: { number: 1 } },
            { fromFile: { number: 1 }, expected: { number: 1 } },
            { fromFile: { number: 'one' }, expected: { number: NaN } },
            { fromFile: { boolean: true }, expected: { boolean: true } },
            { fromFile: { boolean: false }, expected: { boolean: false } },
            { fromFile: { boolean: 1 }, expected: { boolean: true } },
            { fromFile: { boolean: 0 }, expected: { boolean: false } },
            { fromFile: { boolean: 'true' }, expected: { boolean: true } },
            { fromFile: { boolean: 'false' }, expected: { boolean: false } },
            { fromFile: { dates: '2020/03/04' }, expected: { dates: [new Date(2020, 2, 4)] } },
            {
                fromFile: { dates: ['2020/03/04', '2020/05/06'] },
                expected: { dates: [new Date(2020, 2, 4), new Date(2020, 4, 6)] },
            },
        ];

        typeConversionTests.forEach((test) => {
            it(`should convert all configfromFile properties with type conversion function with input: '${JSON.stringify(
                test.fromFile,
            )}'`, () => {
                const result = mergeConfig<ISampleInterface>({}, test.fromFile, options);

                expect(result).toEqual(test.expected);
            });
        });

        it('should return parsed args untouched if configfromFile is empty', () => {
            const parsedArgs: Partial<ISampleInterface> = {
                stringOne: 'stringOneFromArgs',
                stringTwo: 'stringTwoFromArgs',
                number: 36,
                boolean: false,
                dates: [new Date()],
            };
            const result = mergeConfig<ISampleInterface>(parsedArgs, {}, options);

            expect(result).toEqual(parsedArgs);
        });

        it('should return both parsed args and configfromFile properties', () => {
            const parsedArgs: Partial<ISampleInterface> = {
                stringOne: 'stringOneFromArgs',
                boolean: false,
            };
            const configfromFile: Partial<Record<keyof ISampleInterface, any>> = {
                stringTwo: 'stringTwoFromFile',
                number: 55,
            };
            const result = mergeConfig<ISampleInterface>(parsedArgs, configfromFile, options);

            expect(result).toEqual({
                stringOne: 'stringOneFromArgs',
                boolean: false,
                stringTwo: 'stringTwoFromFile',
                number: 55,
            });
        });

        it('should override configfromFile properties with parsed args', () => {
            const parsedArgs: Partial<ISampleInterface> = {
                stringOne: 'stringOneFromArgs',
                number: 55,
                boolean: false,
                dates: [new Date(2020, 5, 1)],
            };
            const configfromFile = {
                stringOne: 'stringOneFromFile',
                stringTwo: 'stringTwoFromFile',
                number: 36,
                boolean: true,
                dates: 'March 1 2020',
                randomOtherProp: '',
            };
            const result = mergeConfig<ISampleInterface>(parsedArgs, configfromFile, options);

            expect(result).toEqual({
                stringOne: 'stringOneFromArgs',
                stringTwo: 'stringTwoFromFile',
                number: 55,
                boolean: false,
                dates: [new Date(2020, 5, 1)],
            });
        });
    });
});
