import { ArgumentConfig } from './contracts';
import {
    IMocked,
    Mock,
    setupFunction,
    replacePropertiesBeforeEach,
    addMatchers,
} from '@morgan-stanley/ts-mocking-bird';
import { parse } from './parse';

describe('parse', () => {
    let mockConsole: IMocked<typeof console>;
    let mockProcess: IMocked<typeof process>;

    interface ComplexProperties {
        requiredString: string;
        defaultedString: string;
        optionalString?: string;
        requiredBoolean: boolean;
        optionalBoolean?: boolean;
        requiredArray: string[];
        optionalArray?: string[];
    }

    interface PropertiesWithHelp extends ComplexProperties {
        optionalHelpArg?: boolean;
    }

    function getConfig(): ArgumentConfig<ComplexProperties> {
        return {
            requiredString: String,
            defaultedString: { type: String, defaultValue: defaultFromOption },
            optionalString: { type: String, optional: true },
            requiredBoolean: Boolean,
            optionalBoolean: { type: Boolean, optional: true },
            requiredArray: { type: String, alias: 'o', multiple: true },
            optionalArray: { type: String, lazyMultiple: true, optional: true },
        };
    }

    function getHelpConfig(): ArgumentConfig<PropertiesWithHelp> {
        return {
            ...getConfig(),
            optionalHelpArg: { type: Boolean, optional: true, alias: 'h', description: 'This help guide' },
        };
    }

    const requiredStringValue = 'requiredStringValue';
    const requiredString = ['--requiredString', requiredStringValue];
    const defaultedStringValue = 'defaultedStringValue';
    const defaultFromOption = 'defaultFromOption';
    const defaultedString = ['--defaultedString', defaultedStringValue];
    const optionalStringValue = 'optionalStringValue';
    const optionalString = ['--optionalString', optionalStringValue];
    const requiredBoolean = ['--requiredBoolean'];
    const optionalBoolean = ['--optionalBoolean'];
    const requiredArrayValue = ['requiredArray'];
    const requiredArray = ['--requiredArray', ...requiredArrayValue];
    const optionalArrayValue = ['optionalArrayValueOne', 'optionalArrayValueTwo'];
    const optionalArray = ['--optionalArray', optionalArrayValue[0], '--optionalArray', optionalArrayValue[1]];
    const optionalHelpArg = ['--optionalHelpArg'];

    replacePropertiesBeforeEach(() => {
        addMatchers();
        mockConsole = Mock.create<typeof console>().setup(setupFunction('error'), setupFunction('log'));
        mockProcess = Mock.create<typeof process>().setup(setupFunction('exit'));

        return [{ package: process, mocks: mockProcess.mock }];
    });

    describe('should create the expected argument value object', () => {
        it('when all options are populated', () => {
            const result = parse(getConfig(), {
                logger: mockConsole.mock,
                argv: [
                    ...requiredString,
                    ...defaultedString,
                    ...optionalString,
                    ...requiredBoolean,
                    ...optionalBoolean,
                    ...requiredArray,
                    ...optionalArray,
                ],
            });

            expect(result).toEqual({
                requiredString: requiredStringValue,
                defaultedString: defaultedStringValue,
                optionalString: optionalStringValue,
                requiredArray: requiredArrayValue,
                optionalArray: optionalArrayValue,
                requiredBoolean: true,
                optionalBoolean: true,
            });
        });

        it('when optional values are ommitted', () => {
            const result = parse(getConfig(), {
                logger: mockConsole.mock,
                argv: [...requiredString, ...requiredArray],
            });

            expect(result).toEqual({
                requiredString: requiredStringValue,
                defaultedString: defaultFromOption,
                requiredArray: requiredArrayValue,
                requiredBoolean: false,
            });
        });
    });

    const expectedRequiredStringMessage = `Required parameter 'requiredString' was not passed. Please provide a value by passing '--requiredString=passedValue' in command line arguments`;
    const expectedRequiredArrayMessage = `Required parameter 'requiredArray' was not passed. Please provide a value by passing '--requiredArray=passedValue' or '-o passedValue' in command line arguments`;

    it(`should print errors and exit process when required arguments are missing`, () => {
        const result = parse(getConfig(), {
            logger: mockConsole.mock,
            argv: [...defaultedString],
        });

        expect(mockConsole.withFunction('error').withParameters(expectedRequiredStringMessage)).wasCalledOnce();
        expect(mockConsole.withFunction('error').withParameters(expectedRequiredArrayMessage)).wasCalledOnce();

        expect(mockProcess.withFunction('exit')).wasCalledOnce();

        expect(result).toBeUndefined();
    });

    it(`should print warnings, return an incomplete result when arguments are missing and exitProcess is false`, () => {
        const result = parse(
            getConfig(),
            {
                logger: mockConsole.mock,
                argv: [...defaultedString],
            },
            false,
        );

        expect(mockConsole.withFunction('error').withParameters(expectedRequiredStringMessage)).wasCalledOnce();
        expect(mockConsole.withFunction('error').withParameters(expectedRequiredArrayMessage)).wasCalledOnce();

        expect(mockProcess.withFunction('exit')).wasNotCalled();

        expect(result).toEqual({
            defaultedString: defaultedStringValue,
            requiredBoolean: false,
        });
    });

    it(`should print help messages and exit when help arg is passed`, () => {
        const result = parse(getHelpConfig(), {
            logger: mockConsole.mock,
            argv: [...optionalHelpArg],
            helpArg: 'optionalHelpArg',
            headerContentSections: [{ header: 'Header', content: 'Header Content' }],
            footerContentSections: [{ header: 'Footer', content: 'Footer Content' }],
        });

        function verifyHelpContent(content: string): string | boolean {
            let currentIndex = 0;

            function verifyNextContent(segment: string) {
                const segmentIndex = content.indexOf(segment);
                if (segmentIndex < 0) {
                    return `Expected help content '${segment}' not found`;
                }
                if (segmentIndex < currentIndex) {
                    return `Help content '${segment}' not in expected place`;
                }

                currentIndex = segmentIndex;
                return true;
            }

            const helpContentSegments = [
                'Header',
                'Header Content',
                '-h',
                '--optionalHelpArg',
                'This help guide',
                'Footer',
                'Footer Content',
            ];

            const failures = helpContentSegments.map(verifyNextContent).filter((result) => result !== true);

            if (failures.length > 0) {
                return failures[0];
            }

            return true;
        }

        expect(result).toBeUndefined();
        expect(mockProcess.withFunction('exit')).wasCalledOnce();
        expect(mockConsole.withFunction('error')).wasNotCalled();
        expect(mockConsole.withFunction('log').withParameters(verifyHelpContent)).wasCalledOnce();
    });

    it(`it should print help messages and return partial arguments when help arg passed and exitProcess is false`, () => {
        const result = parse(
            getHelpConfig(),
            {
                logger: mockConsole.mock,
                argv: [...defaultedString, ...optionalHelpArg],
                helpArg: 'optionalHelpArg',
                headerContentSections: [{ header: 'Header', content: 'Header Content' }],
                footerContentSections: [{ header: 'Footer', content: 'Footer Content' }],
            },
            false,
        );

        expect(result).toEqual({
            defaultedString: defaultedStringValue,
            optionalHelpArg: true,
            requiredBoolean: false,
        });
        expect(mockProcess.withFunction('exit')).wasNotCalled();
        expect(mockConsole.withFunction('log')).wasCalledOnce();
    });
});
