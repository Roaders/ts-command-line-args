/* eslint-disable no-unused-vars */
import { ArgumentConfig } from './contracts'

describe('contracts', () => {
    describe('ArgumentConfig', () => {
        describe('required properties', () => {
            interface AllRequired{
                name: string;
                age: number;
                member: boolean;
            }

            it('should allow object with sample values', () => {
                const sampleConfig: ArgumentConfig<AllRequired> = {
                    name: String,
                    age: Number,
                    member: Boolean
                }
            })

            it('should allow an object with type option definitions', () => {
                const config: ArgumentConfig<AllRequired> = {
                    name: { type: String },
                    age: { type: Number },
                    member: { type: Boolean }
                }
            })

            it('should not allow missing properties', () => {
                // @ts-expect-error
                const config: ArgumentConfig<AllRequired> = {
                    name: String,
                    age: Number
                }
            })

            it('should not allow wrong sample type', () => {
                const configSample: ArgumentConfig<AllRequired> = {
                    // @ts-expect-error
                    name: Number,
                    age: Number,
                    member: Boolean
                }

                const configTypeOption: ArgumentConfig<AllRequired> = {
                    // @ts-expect-error
                    name: { type: Number },
                    age: { type: Number },
                    member: { type: Boolean }
                }
            })
        })

        describe('optional properties', () => {
            interface AllOptional{
                name?: string;
                age?: number;
                member?: boolean;
            }

            it('should not allow object with sample values', () => {
                const config: ArgumentConfig<AllOptional> = {
                    // @ts-expect-error
                    name: String,
                    // @ts-expect-error
                    age: Number,
                    // @ts-expect-error
                    member: Boolean
                }
            })

            it('should allow an object with type option definitions', () => {
                const config: ArgumentConfig<AllOptional> = {
                    name: { type: String, optional: true },
                    age: { type: Number, optional: true },
                    member: { type: Boolean, optional: true }
                }
            })

            it('should not allow missing properties', () => {
                // @ts-expect-error
                const config: ArgumentConfig<AllOptional> = {
                    name: { type: String, optional: true },
                    age: { type: Number, optional: true }
                }
            })

            it('should not allow wrong sample type', () => {
                const configTypeOption: ArgumentConfig<AllOptional> = {
                    // @ts-expect-error
                    name: { type: Number, optional: true },
                    age: { type: Number, optional: true },
                    member: { type: Boolean, optional: true }
                }
            })
        })

        describe('nullable properties', () => {
            interface AllOptional{
                name: string | null;
                age: number | null;
                member: boolean | null;
            }

            it('should not allow object with sample values', () => {
                const config: ArgumentConfig<AllOptional> = {
                    // @ts-expect-error
                    name: String,
                    // @ts-expect-error
                    age: Number,
                    // @ts-expect-error
                    member: Boolean
                }
            })

            it('should allow an object with type option definitions', () => {
                const config: ArgumentConfig<AllOptional> = {
                    name: { type: String, nullable: true },
                    age: { type: Number, nullable: true },
                    member: { type: Boolean, nullable: true }
                }
            })

            it('should not allow missing properties', () => {
                // @ts-expect-error
                const config: ArgumentConfig<AllOptional> = {
                    name: { type: String, nullable: true },
                    age: { type: Number, nullable: true }
                }
            })

            it('should not allow wrong sample type', () => {
                const configTypeOption: ArgumentConfig<AllOptional> = {
                    // @ts-expect-error
                    name: { type: Number, nullable: true },
                    age: { type: Number, nullable: true },
                    member: { type: Boolean, nullable: true }
                }
            })
        })

        describe('nullable optional properties', () => {
            interface AllOptional{
                name?: string | null;
                age?: number | null;
                member?: boolean | null;
            }

            it('should not allow object with sample values', () => {
                const config: ArgumentConfig<AllOptional> = {
                    // @ts-expect-error
                    name: String,
                    // @ts-expect-error
                    age: Number,
                    // @ts-expect-error
                    member: Boolean
                }
            })

            it('should allow an object with type option definitions', () => {
                const config: ArgumentConfig<AllOptional> = {
                    name: { type: String, optional: true },
                    age: { type: Number, optional: true },
                    member: { type: Boolean, optional: true }
                }
            })

            it('should not allow missing properties', () => {
                // @ts-expect-error
                const config: ArgumentConfig<AllOptional> = {
                    name: { type: String, optional: true },
                    age: { type: Number, optional: true }
                }
            })

            it('should not allow wrong sample type', () => {
                const configTypeOption: ArgumentConfig<AllOptional> = {
                    // @ts-expect-error
                    name: { type: Number, optional: true },
                    age: { type: Number, optional: true },
                    member: { type: Boolean, optional: true }
                }
            })
        })
    })
})
