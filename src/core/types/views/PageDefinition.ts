import { PageAction } from "./PageAction";
import { ViewDefinition, ViewProperties } from "./ViewDefinition";

type EventMap = {
	infoChanged: string;
};

/**
 * Definition of a page.
 */
export abstract class PageDefinition<
	P extends ViewProperties
> extends ViewDefinition<P, EventMap> {
	/**
	 * Title info about the page.
	 * E.g. in a nested  deck, this could be the name of the deck.
	 */
	public abstract getActions(): PageAction[];

	public onUpdate: (properties: P) => void = () => {};

	protected setInfo(title: string) {
		this.emit("infoChanged", title);
	}

	public onUnload = () => {
		console.log("On unload", this.id);
		this.setInfo("");
	};
}
