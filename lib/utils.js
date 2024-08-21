// dep modules
import c, { Chalk } from 'chalk';
// constants
export const defaultLayout = {
    spacing: 2,
    width: 80,
    indent: 2
};
export const defaultColors = {
    description: c.white,
    title: c.yellow.bold,
    flag: c.greenBright,
    flagDescription: c.white,
    flagDefault: c.gray
};
const flagSep = ', ';
// eslint-disable-next-line no-control-regex
export const reBgEnd = /\u001B\[49m/;
/**
 * Ensures the availability of colors for the CLI.
 * @param [userColors] - Optional user-defined colors.
 */
export function ensureColors(userColors) {
    const colors = { ...defaultColors };
    // eslint-disable-next-line guard-for-in
    for (const key in defaultColors) {
        colors[key] = userColors?.[key]
            ? getChalk(userColors[key])
            : defaultColors[key];
    }
    return colors;
}
/**
 * Iterates over each flag in the provided `flags` object and invokes the
 * callback function `cb` for each flag.
 * @param [flags] - The object containing the flags.
 * @param [cb] - The callback function to be invoked for each flag. It receives
 * the flag's name and the flag itself as parameters.
 */
export function eachFlag(flags, cb) {
    for (const name in flags) {
        if (cb && Object.prototype.hasOwnProperty.call(flags, name)) {
            cb(name, flags[name]);
        }
    }
}
/**
 * Converts a camel case string to a flag format.
 * @param str - The camel case string to convert.
 */
function camelToFlag(str) {
    const prefix = str.length > 1 ? '--' : '-';
    return prefix + str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
}
/**
 * Retrieves the flag names for a given flag.
 * @param name - The name of the flag.
 * @param flag - The flag object.
 */
export function getFlagNames(name, flag) {
    const names = [camelToFlag(name)];
    if (flag.shortFlag) {
        names.push(camelToFlag(flag.shortFlag));
    }
    // if (flag.aliases) {
    //   names.push(...flag.aliases.map(camelToFlag));
    // }
    return names.join(flagSep);
}
/**
 * Wraps a given input string into an array of strings, where each string
 * represents a line of text that does not exceed the specified wrapAt length.
 * @param input - The input string to be wrapped.
 * @param wrapAt - The maximum length of each line.
 * @param chlk - The ChalkInstance used for styling the lines.
 * @returns An array of strings representing the wrapped lines.
 */
export function wordWrap(input, wrapAt, chlk) {
    input = hardTrim(input);
    // split by any whitespace, keeping separators (spaces and newlines)
    const words = input.split(/(\s+)/);
    // default to no styling if chlk is not provided
    // chlk = chlk || ((str: string) => str) as ChalkInstance;
    const result = [];
    let currentLine = '';
    for (const word of words) {
        // handle newlines as hard breaks
        if (word.match(/[\r\n]/)) {
            if (currentLine) {
                result.push(chlk(currentLine.trim()));
                currentLine = '';
            }
            continue; // ignore the newline character itself
        }
        // check if adding the word exceeds the max length
        if (currentLine.length + word.length <= wrapAt) {
            currentLine += word;
        }
        else {
            result.push(chlk(currentLine.trim()));
            currentLine = word.trim(); // start a new line with the current word
        }
    }
    // push the last remaining line
    if (currentLine) {
        result.push(chlk(currentLine.trim()));
    }
    return result;
}
/**
 * Trims the leading and trailing whitespace (including new lines) from a
 * string.
 * @param [str] - The string to trim.
 */
export function hardTrim(str) {
    return (str ?? '').replace(/^\s+|\s+$/g, '');
}
/**
 * Retrieves a ChalkInstance object based on the provided color.
 * If the color is a string, it can be a color name or a hexadecimal value.
 * If the color is a ChalkInstance object, it is returned as is.
 * If the color is a dot-separated string, it is treated as a chain of ChalkInstance styles.
 * @param [color] - The color to retrieve the ChalkInstance object for.
 */
function getChalk(color) {
    if (typeof color !== 'string')
        return color;
    if (color.startsWith('#'))
        return c.hex(color);
    if (!color.includes('.'))
        return c[color];
    const styles = color.split('.');
    let chlk = new Chalk();
    styles.forEach(style => { chlk = chlk[style]; });
    return chlk;
}
//# sourceMappingURL=utils.js.map