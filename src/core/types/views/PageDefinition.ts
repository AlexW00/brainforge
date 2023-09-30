import { PageAction } from "./PageAction";
import { ViewDefinition, ViewProperties } from "./ViewDefinition";

/**
 * Definition of a page.
 */
export abstract class PageDefinition<
	P extends ViewProperties
> extends ViewDefinition<P> {
	/**
	 * Title info about the page.
	 * E.g. in a nested  deck, this could be the name of the deck.
	 */
	public abstract getTitle(): string;
	public abstract getActions(): PageAction[];
}
