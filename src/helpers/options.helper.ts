import { ParseOptions, OptionContent } from '../contracts';

export function getOptionSections(options: ParseOptions<any>): OptionContent[] {
    return (
        options.optionSections || [
            { header: options.optionsHeaderText || 'Options', headerLevel: options.optionsHeaderLevel || 2 },
        ]
    );
}
