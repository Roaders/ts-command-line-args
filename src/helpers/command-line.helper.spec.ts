import { createCommandLineConfig, createEnvArgv, parseConfigFromFile, normaliseConfig } from './command-line.helper';
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
            requiredStringTwo: { type: String, env: 'REQUIRED_STRING_TWO', description: 'string two description' },
            optionalString: { type: String, optional: true, env: 'OPTIONAL_STRING' },
            requiredArray: { type: String, multiple: true, env: 'REQUIRED_ARRAY' },
            optionalArray: { type: String, lazyMultiple: true, optional: true, env: 'OPTIONAL_ARRAY' },
        };
    }

    describe('normaliseConfig', () => {
        it('should replace type constructors with objects', () => {
            const normalised = normaliseConfig(getConfig());

            expect(normalised).toEqual({
                requiredStringOne: { type: String },
                requiredStringTwo: { type: String, env: 'REQUIRED_STRING_TWO', description: 'string two description' },
                optionalString: { type: String, optional: true, env: 'OPTIONAL_STRING' },
                requiredArray: { type: String, multiple: true, env: 'REQUIRED_ARRAY' },
                optionalArray: { type: String, lazyMultiple: true, optional: true, env: 'OPTIONAL_ARRAY' },
            });
        });
    });

    describe('createCommandLineConfig', () => {
        it('should create expected config', () => {
            const commandLineConfig = createCommandLineConfig(normaliseConfig(getConfig()));

            expect(commandLineConfig).toEqual([
                { name: 'requiredStringOne', type: String },
                {
                    name: 'requiredStringTwo',
                    type: String,
                    description: 'string two description (env: REQUIRED_STRING_TWO)',
                },
                { name: 'optionalString', type: String, optional: true, description: '(env: OPTIONAL_STRING)' },
                { name: 'requiredArray', type: String, multiple: true, description: '(env: REQUIRED_ARRAY)' },
                {
                    name: 'optionalArray',
                    type: String,
                    lazyMultiple: true,
                    optional: true,
                    description: '(env: OPTIONAL_ARRAY)',
                },
            ]);
        });
    });

    describe('createEnvArgv', () => {
        it('should create expected argv', () => {
            process.env['REQUIRED_STRING_TWO'] = 'requiredStringTwoFromEnv';
            process.env['REQUIRED_ARRAY'] = 'requiredArrayFromEnv';
            const envArgv = createEnvArgv(normaliseConfig(getConfig()));

            expect(envArgv).toEqual([
                '--requiredStringTwo',
                'requiredStringTwoFromEnv',
                '--requiredArray',
                'requiredArrayFromEnv',
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
            optionalObject?: { value: string };
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
                optionalObject: { type: (value) => (typeof value === 'string' ? { value } : value), optional: true },
                configPath: { type: String, optional: true },
            };
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
                const result = parseConfigFromFile<ISampleInterface>(undefined, test.fromFile, options);

                expect(result).toEqual(test.expected);
            });
        });
    });
});
