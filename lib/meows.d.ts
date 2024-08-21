import meow from 'meow';
import { CliOptions } from './types.js';
/**
 * Styled version of the `meow` function that provides a more customizable CLI
 * output.
 * @param options - The options object for configuring CLI output.
 */
export declare function meows(options: CliOptions): ReturnType<typeof meow>;
