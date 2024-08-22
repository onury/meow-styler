import { ChalkInstance } from 'chalk';
import { CliLayout, CliColors, AnyFlag, AnyFlags } from './types.js';
export declare const defaultLayout: Required<CliLayout>;
export declare const defaultColors: Record<keyof CliColors, ChalkInstance>;
export declare const reBgEnd: RegExp;
/**
 * Ensures the availability of colors for the CLI.
 * @param [userColors] - Optional user-defined colors.
 */
export declare function ensureColors(userColors?: CliColors): Record<keyof CliColors, ChalkInstance>;
/**
 * Iterates over each flag in the provided `flags` object and invokes the
 * callback function `cb` for each flag.
 * @param [flags] - The object containing the flags.
 * @param [cb] - The callback function to be invoked for each flag. It receives
 * the flag's name and the flag itself as parameters.
 */
export declare function eachFlag(flags?: AnyFlags, cb?: (name: string, flag: AnyFlag) => void): void;
/**
 * Retrieves the flag names for a given flag.
 * @param name - The name of the flag.
 * @param flag - The flag object.
 */
export declare function getFlagNames(name: string, flag: AnyFlag): string;
/**
 * Wraps a given input string into an array of strings, where each string
 * represents a line of text that does not exceed the specified wrapAt length.
 * @param input - The input string to be wrapped.
 * @param wrapAt - The maximum length of each line.
 * @param chlk - The ChalkInstance used for styling the lines.
 * @returns An array of strings representing the wrapped lines.
 */
export declare function wordWrap(input: string, wrapAt: number, chlk: ChalkInstance): string[];
/**
 * Trims the leading and trailing whitespace (including new lines) from a
 * string.
 * @param [str] - The string to trim.
 */
export declare function hardTrim(str?: string): string;
