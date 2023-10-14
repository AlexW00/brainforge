import { Observable } from "../events/Observable";
import { IdentifiableConstructor } from "../general/Constructor";
import { Identifiable } from "../general/Identifiable";
import { Metadata } from "../general/Metadata";

export type ViewProperties = any;

/**
 * A view is a custom UI element.
 */
export abstract class ViewDefinition<
		P extends ViewProperties,
		E extends Record<string, any>
	>
	extends Observable<E>
	implements Metadata
{
	public abstract readonly id: string;
	public abstract readonly name: string;
	public description: string = "";

	public abstract onLoad: (properties: P, container: HTMLElement) => void;
	public onUnload: () => void = () => {};
}
