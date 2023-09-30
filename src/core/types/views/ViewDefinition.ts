import { Identifiable } from "../general/Identifiable";

type ViewProperties = any;

/**
 * A view is a custom UI element.
 */
export interface ViewDefinition extends Identifiable {
	name: string;

	onLoad: (properties: ViewProperties) => void;
	onUnload: () => void;
	onUpdate: (properties: ViewProperties) => void;
}
