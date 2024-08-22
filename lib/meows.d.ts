import { CliOptions, CliResult, AnyFlags } from './types.js';
/**
 * Styled version of the `meow` function that provides a more customizable CLI
 * output.
 * @param options - The options object for configuring CLI output.
 */
export declare function meows<T extends AnyFlags>(options: CliOptions<T>): CliResult<T>;
