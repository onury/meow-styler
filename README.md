<h1 align="center" style="margin-bottom:30px">
  <code>meow-styler</code>
</h1>

<p align="center">
  <a href="https://github.com/onury/meow-styler/actions/workflows/node.js.yml"><img src="https://github.com/onury/meow-styler/actions/workflows/node.js.yml/badge.svg" alt="build" /></a>
  <a href="https://github.com/onury/meow-styler/blob/main/vitest.config.ts"><img src="https://img.shields.io/badge/coverage-100%25-2BB150?logo=vitest&style=flat" alt="coverage" /></a>
  <a href="https://raw.github.com/onury/meow-styler"><img src="https://img.shields.io/npm/v/meow-styler.svg?style=flat&label=version&color=%2394306B&logo=npm" alt="version" /></a>
  <a href="https://gist.github.com/onury/d3f3d765d7db2e8b2d050d14315f2ac7"><img src="https://img.shields.io/badge/ESM-F7DF1E?style=flat" alt="ESM" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3260C7?logo=typescript&logoColor=ffffff&style=flat" alt="TS" /></a>
  <a href="https://github.com/onury/meow-styler/blob/master/LICENSE"><img src="https://img.shields.io/github/license/onury/meow-styler?style=flat" alt="license" /></a>
  <br />
    <sub>© 2024, Onur Yıldırım (<b><a href="https://github.com/onury">@onury</a></b>)</sub>
</p>
<br />

Colors & formatting for [meow](https://github.com/sindresorhus/meow) CLI app helper.

## Installation

```sh
npm i meow-styler meow
```

**Important**: This module is **ESM** 🔆. Please [**read this**](https://gist.github.com/onury/d3f3d765d7db2e8b2d050d14315f2ac7). 


## Usage

`meow-styler` is just a helper for `meow`, that provides styles & formatting. This keeps the meow API almost the same and only adds the following options:
- Each flag has a `description` field.
- Options object includes `usage`, `layout`, `colors` and `examples` fields.

```typescript
#!/usr/bin/env node
import { meows } from 'meow-styler';
import foo from './lib/index.js';

const cli = meows({
  importMeta: import.meta, // This is required
  description: 'My awesome CLI',
  usage: 'foo <input>',
  examples: c => `
  $ foo unicorns ${c.yellow('--rainbow -c')} beer
  🌈 unicorns 🍺
  `,
  helpIndent: 2,
  layout: {
    width: 90,
    spacing: 2,
    indent: 2
  },
  colors: c => ({
    description: c.white,
    flag: c.greenBright,
    flagDescription: c.white,
    title: 'yellow.bold', // can also pass a string
  }),
  flags: {
    rainbow: {
      description: 'Include a rainbow',
      type: 'boolean',
      shortFlag: 'r'
    },
    cheers: {
      description: 'Get me a drink',
      type: 'string',
      shortFlag: 'c',
      choices: ['beer', 'whisky'],
      isMultiple: true
    }
  }
});

foo(cli.input.at(0), cli.flags);
```

For more details about **meow** and options, see its [repo docs](https://github.com/sindresorhus/meow?tab=readme-ov-file#meow).

## License

**MIT** ©️ Onur Yıldırım.
