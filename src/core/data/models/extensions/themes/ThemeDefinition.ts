import { ThemeMetadata } from "./ThemeMetadata";

/**
 * Defines a theme.
 */
export interface ThemeDefinition extends ThemeMetadata {
	css: string;
}
