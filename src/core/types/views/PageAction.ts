import { Identifiable } from "../general/Identifiable";

/**
 * A page action is a button that can be added to the page header.
 */
export interface PageAction extends Identifiable {
	title: string;
	onClick: () => void;
}
