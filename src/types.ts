// dep modules
import { Flag, Options } from 'meow';
import c, { ChalkInstance } from 'chalk';

export { c as chalk };

type StringFlag = Flag<'string', string> | Flag<'string', string[], true>;
type BooleanFlag = Flag<'boolean', boolean> | Flag<'boolean', boolean[], true>;
type NumberFlag = Flag<'number', number> | Flag<'number', number[], true>;

/**
 * Represents a flag that can be of type StringFlag, BooleanFlag, or NumberFlag.
 */
export type AnyFlag = (StringFlag | BooleanFlag | NumberFlag) & {
  /** The description of the flag. */
  description?: string;
};

/**
 * Represents a collection of CLI flags.
 */
export type CliFlags = Record<string, AnyFlag>;

/**
 * Represents the layout options for the CLI.
 */
export interface CliLayout {
  spacing?: number;
  width?: number;
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
export interface CliOptions extends Options<CliFlags> {
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
}
