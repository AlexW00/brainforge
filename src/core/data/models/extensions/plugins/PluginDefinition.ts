import { PluginMetadata } from "./PluginMetadata";

/**
 * Represents a plugin definition.
 * A plugin allows to extend the functionality of the application.
 * E.g. a plugin can add a new node type to the template editor.
 */
export interface PluginDefinition {
	metadata: PluginMetadata;

	onLoad(): Promise<void>;
	onUnload(): Promise<void>;
}
