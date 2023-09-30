import { ViewDefinition, ViewProperties } from "./ViewDefinition";

/**
 * A modal is a view that is displayed on top of the current view.
 */
export abstract class ModalDefinition<
	P extends ViewProperties
> extends ViewDefinition<P> {
	protected doAllowMultipleInstances: boolean = false;
}
