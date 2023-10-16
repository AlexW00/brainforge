import { ViewDefinition, ViewProperties } from "./ViewDefinition";

type EventMap = {
	close: undefined;
};

/**
 * A modal is a view that is displayed on top of the current view.
 */
export abstract class ModalDefinition<
	P extends ViewProperties
> extends ViewDefinition<P, EventMap> {
	protected doAllowMultipleInstances: boolean = false;
	doShowBackground: boolean = true;

	maxWidth: string = "70%";
	maxHeight: string = "70%";

	protected close() {
		this.emit("close", undefined);
	}
}
