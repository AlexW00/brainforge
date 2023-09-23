import { ThemeMetadata } from "./ThemeMetadata";

/**
 * Defines a theme.
 */
export interface ThemeDefinition {
	metadata: ThemeMetadata;
	css: string;
}
