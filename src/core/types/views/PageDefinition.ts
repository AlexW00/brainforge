import { ViewDefinition } from "./ViewDefinition";

/**
 * Definition of a page.
 */
export interface PageDefinition extends ViewDefinition {
	/**
	 * Head info about the page.
	 * E.g. in a nested  deck, this could be the name of the deck.
	 */
	getHead(): string;
}
