// core modules
import { EOL } from 'node:os';
// dep modules
import meow from 'meow';
import c from 'chalk';
import { defaultLayout, eachFlag, getFlagNames, ensureColors, wordWrap, reBgEnd } from './utils.js';
/**
 * Styled version of the `meow` function that provides a more customizable CLI
 * output.
 * @param options - The options object for configuring CLI output.
 */
export function meows(options) {
    const { spacing, indent } = {
        ...defaultLayout,
        ...options?.layout
    };
    const width = (options?.layout?.width || defaultLayout.width) - (options.helpIndent || 0);
    let leftWidth = 0;
    eachFlag(options?.flags, (name, flag) => {
        const names = getFlagNames(name, flag);
        leftWidth = Math.max(leftWidth, names.length);
    });
    const rightWidth = width - indent - leftWidth - spacing;
    const userColors = typeof options?.colors === 'function'
        ? options.colors(c)
        : options?.colors;
    const colors = ensureColors(userColors);
    const option = (name, flag) => {
        let { type, description, default: defa, choices } = flag;
        const names = getFlagNames(name, flag); // TODO: add aliases ?
        description = description || type || '';
        const rightStart = indent + leftWidth + spacing;
        const current = indent + names.length + spacing;
        const choicesStr = choices ? ` One of: ${choices.join(', ')}` : '';
        return ' '.repeat(indent)
            + colors.flag(names)
            + ' '.repeat(spacing)
            + ' '.repeat(Math.max(rightStart - current, 0))
            + wordWrap(description + choicesStr, rightWidth, colors.flagDescription).join(EOL + ' '.repeat(rightStart))
            + (defa ? `${EOL}${' '.repeat(rightStart)}${colors.flagDefault('Default: ' + defa)}` : '');
    };
    const optList = [];
    eachFlag(options?.flags, (name, flag) => {
        optList.push(option(name, flag));
    });
    // test for the bg close character in the title color
    const titleHasBg = reBgEnd.test(colors.title('test'))
        /* v8 ignore next */ && c.level > 0; // check if chalk detected color support
    // if a bg color is defined for a title, add a space before and after the title
    const title = (str) => {
        /* v8 ignore next */
        const s = titleHasBg ? ' ' : '';
        return colors.title(s + str + s);
    };
    if (options.description) {
        const sDesc = wordWrap(options.description, width, colors.description).join(EOL);
        options = {
            ...options,
            // reset the readonly description property
            description: sDesc
        };
    }
    const helpMessage = [];
    const innerIndent = (str) => ' '.repeat(indent)
        + str.split(/[\r\n]/).map(s => s.trim()).join(EOL + ' '.repeat(indent));
    const sUsage = typeof options.usage === 'function' ? options.usage(c) : options.usage;
    if (sUsage)
        helpMessage.push(title('Usage'), innerIndent(sUsage) + EOL);
    const sOptions = optList.join(EOL);
    if (sOptions.length > 0)
        helpMessage.push(title('Options'), sOptions, '');
    const sExamples = typeof options.examples === 'function' ? options.examples(c) : options.examples;
    if (sExamples)
        helpMessage.push(title('Examples'), innerIndent(sExamples));
    return meow(helpMessage.join(EOL), options);
}
//# sourceMappingURL=meows.js.map