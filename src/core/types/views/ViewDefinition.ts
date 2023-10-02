import { Observable } from "../events/Observable";
import { Identifiable } from "../general/Identifiable";

export type ViewProperties = any;

/**
 * A view is a custom UI element.
 */
export abstract class ViewDefinition<
		P extends ViewProperties,
		E extends Record<string, any>
	>
	extends Observable<E>
	implements Identifiable
{
	public abstract readonly id: string;
	public abstract readonly name: string;

	public abstract onLoad: (properties: P, container: HTMLElement) => void;
	public onUnload: () => void = () => {};
}
