import { ViewDefinition } from "./ViewDefinition";

/**
 * A modal is a view that is displayed on top of the current view.
 */
export interface ModalDefinition extends ViewDefinition {
	doAllowMultipleInstances: boolean;
}
