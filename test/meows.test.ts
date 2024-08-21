/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { defaultLayout } from '../src/utils.js';
import { meows, chalk as c, CliOptions, CliFlags, CliLayout } from '../src/index.js';

const longestDesc1 = 'Longest flag with choices and longest description that';
const longestDesc2 = 'should word-wrap.';
const colorsFn = (chlk: typeof c): any => ({
  title: 'yellow.bold',
  flag: chlk.cyan,
  flagDescription: chlk.green,
  flagDefault: 'gray'
});
const options: CliOptions = {
  importMeta: import.meta,
  description: 'A test CLI',
  usage: _c => c.dim.cyan('$') + c.blueBright(' foo ') + c.cyan('<url> ') + c.green.dim('[options]'),
  examples: _c => c.dim.cyan('$') + c.blueBright(' foo ') + c.cyan('https://example.com ') + c.green('--flag val'),
  helpIndent: 2,
  colors: colorsFn,
  flags: {
    flag: {
      type: 'string',
      shortFlag: 'f',
      description: 'First flag'
    },
    longestFlag: {
      type: 'string',
      description: longestDesc1 + ' ' + longestDesc2,
      choices: ['val1', 'val2']
    },
    noDesc: {
      'type': 'boolean',
      'default': true
    },
    none: {}
  }
};

const calc = (opts: CliOptions) => {
  const lo: Required<CliLayout> = {
    ...defaultLayout,
    ...opts.layout
  };
  const longest = '--longest-flag';
  const lenLongest = longest.length;
  const hi = opts.helpIndent ?? 0;
  const left = hi + lo.indent + lenLongest + lo.spacing;
  const sLeftSpace = ' '.repeat(left);
  const sHIndent = ' '.repeat(hi);
  const sIndent = ' '.repeat(lo.indent);
  const sSpacing = ' '.repeat(lo.spacing);

  return { sLeftSpace, sHIndent, sIndent, sSpacing, lenLongest };
};

const expected = (opts: CliOptions): string => {
  const { sLeftSpace, sHIndent, sIndent, sSpacing } = calc(opts);
  const f = opts.flags as CliFlags;
  const usage = typeof opts.usage === 'function' ? opts.usage(c) : opts.usage;
  const examples = typeof opts.examples === 'function' ? opts.examples(c) : opts.examples;

  const sUsage = usage ? `${sHIndent}${c.yellow.bold('Usage')}
${sHIndent}${sIndent}${usage}

` : '';

  const sExamples = examples ? `
${sHIndent}${c.yellow.bold('Examples')}
${sHIndent}${sIndent}${examples?.split(/[\r\n]/).map(s => s.trim()).join(`\n${sHIndent}${sIndent}`)}
` : '';

  return `
${sHIndent}${c.white(opts.description)}

${sUsage}${sHIndent}${c.yellow.bold('Options')}
${sHIndent}${sIndent}${c.cyan('--flag, -f')}    ${sSpacing}${c.green(f.flag.description)}
${sHIndent}${sIndent}${c.cyan('--longest-flag')}${sSpacing}${c.green(longestDesc1)}
${sLeftSpace}${c.green(longestDesc2 + ' One of: ' + f.longestFlag.choices?.join(', '))}
${sHIndent}${sIndent}${c.cyan('--no-desc')}     ${sSpacing}${c.green(f.noDesc.type)}
${sLeftSpace}${c.gray('Default: ' + f.noDesc.default)}
${sHIndent}${sIndent}${c.cyan('--none')}       ${sSpacing}${` `}
${sExamples}`;
};

describe('meows', () => {

  test('styled output', () => {
    expect(meows(options).help).toMatch(expected(options));
  });

  test('usage', () => {
    const usage = (options.usage as Function)(c);
    const o: CliOptions = {
      ...options,
      usage: c.dim.cyan('$') + c.blueBright('bar')
    };
    expect(meows(o).help).toMatch(
      expected(o)
        .replace(usage, o.usage as string)
    );

    // no examples
    o.usage = undefined;
    expect(meows(o).help).toMatch(expected(o));
  });

  test('examples', () => {
    const examples = (options.examples as Function)(c);
    const o: CliOptions = {
      ...options,
      examples: `${c.dim.cyan('$')} ${c.blueBright('bar')} ${c.cyan('https://test.com ')}${c.green('-f val')}`
        + `\n${c.dim.cyan('$')} ${c.blueBright('baz')} ${c.cyan('https://google.com ')}${c.green('--longest-flag val')}`
    };
    expect(meows(o).help).toMatch(
      expected(o)
        .replace(examples, o.examples as string)
    );

    // no examples
    o.examples = undefined;
    expect(meows(o).help).toMatch(expected(o));
  });

  test('colors object', () => {
    const o = { ...options, colors: colorsFn(c) };
    expect(meows(o).help).toMatch(expected(o));
  });

  test('title bg', () => {
    const o = {
      ...options,
      colors: {
        ...colorsFn(c),
        title: 'yellow.bgRed.bold'
      }
    };

    // titles include a leading and trailing space when bg color is defined. but
    // this depends on the color support level
    const wrap = (str: string): string => c.level > 0 ? ` ${str} ` : str;

    expect(meows(o).help).toMatch(
      expected(o)
        .replace(c.yellow.bold('Usage'), c.yellow.bgRed.bold(wrap('Usage')))
        .replace(c.yellow.bold('Options'), c.yellow.bgRed.bold(wrap('Options')))
        .replace(c.yellow.bold('Examples'), c.yellow.bgRed.bold(wrap('Examples')))
    );
  });

  test('layout', () => {
    const o = {
      ...options,
      helpIndent: 0,
      layout: {
        indent: 4,
        spacing: 3,
        width: 80
      }
    };
    expect(meows(o).help).toMatch(expected(o));
  });

  test('hard linebreak', () => {
    const o = {
      ...options,
      flags: {
        ...options.flags,
        none: {
          type: 'string',
          description: 'Flag with a\nhard linebreak'
        } as any
      }
    };
    const { sLeftSpace, sHIndent, sIndent, sSpacing, lenLongest } = calc(o);
    // console.info(meows(o).help);
    const s = ' '.repeat(lenLongest - '--none'.length);
    expect(meows(o).help).toMatch(
      expected(o)
        .replace(
          /^.*--none.*$/gm,
          `${sHIndent}${sIndent}${c.cyan('--none')}${s}${sSpacing}`
          + `${c.green('Flag with a')}\n${sLeftSpace}${c.green('hard linebreak')}`
        )
    );
  });

  test('hex color', () => {
    const hex = '#FFF';
    const o = {
      ...options,
      description: '!!HEX DESC!!',
      colors: {
        ...colorsFn(c),
        description: hex
      }
    };
    const { sHIndent } = calc(o);
    expect(meows(o).help).toMatch(
      expected(o)
        .replace(
          new RegExp('^.*' + o.description as string + '.*$', 'gm'),
          `${sHIndent}${c.hex(hex)(o.description)}`
        )
    );
  });

});
