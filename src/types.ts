// dep modules
import { Flag, FlagType, Options, Result } from 'meow';
import c, { ChalkInstance } from 'chalk';

export { c as chalk };

type TypedFlag<F extends AnyFlag> =
  F extends { type: 'number' }
    ? number
    : F extends { type: 'string' }
      ? string
      : F extends { type: 'boolean' }
        ? boolean
        : unknown;

type ExtendedFlag<PrimitiveType extends FlagType, Type, IsMultiple = false> = Flag<PrimitiveType, Type, IsMultiple> & {
  /** The description of the flag. */
  description?: string;
};
type StringFlag = ExtendedFlag<'string', string> | ExtendedFlag<'string', string[], true>;
type BooleanFlag = ExtendedFlag<'boolean', boolean> | ExtendedFlag<'boolean', boolean[], true>;
type NumberFlag = ExtendedFlag<'number', number> | ExtendedFlag<'number', number[], true>;

/**
 * Represents a flag that can be of type StringFlag, BooleanFlag, or NumberFlag.
 */
export type AnyFlag = StringFlag | BooleanFlag | NumberFlag;

/**
 * Represents a collection of CLI flags.
 */
export type AnyFlags = Record<string, AnyFlag>;

/**
 * Represents the layout options for the CLI.
 */
export interface CliLayout {
  /**
   * Spacing between flag(s) and flag description.
   * @default 2
   */
  spacing?: number;
  /**
   * Total width of the CLI output (including `helpIndent`).
   * @default 80
   */
  width?: number;
  /**
   * Inner indentation for flag(s), usage text & example text.
   * @default 2
   */
  indent?: number;
}

/**
 * Represents the color options for the CLI.
 */
export interface CliColors {
  description?: string | ChalkInstance;
  title?: string | ChalkInstance;
  flag?: string | ChalkInstance;
  flagDescription?: string | ChalkInstance;
  flagDefault?: string | ChalkInstance;
}

/**
 * Represents the options for the CLI.
 */
export type CliOptions<Flags extends AnyFlags> = Options<Flags> & {
  /**
   * The usage information for the CLI.
   */
  usage?: string | ((chalk: ChalkInstance) => string);
  /**
   * The examples for the CLI.
   */
  examples?: string | ((chalk: ChalkInstance) => string);
  /**
   * The layout options for the CLI.
   */
  layout?: CliLayout;
  /**
   * The color options for the CLI.
   */
  colors?: CliColors | ((chalk: ChalkInstance) => CliColors);
};

/**
 * Represents the result of a CLI operation.
 */
export type CliResult<Flags extends AnyFlags> = Omit<Result<Flags>, 'flags'> & {
  flags: {
    [F in keyof Flags]: Flags[F] extends { isMultiple: true }
      ? TypedFlag<Flags[F]>[]
      : TypedFlag<Flags[F]>;
  };
};
