import { Identifiable } from "./Identifiable";

/**
 * Metadata provides extra information about an object.
 */
export interface Metadata extends Identifiable {
	id: string;
	name: string;
	description: string;
}
