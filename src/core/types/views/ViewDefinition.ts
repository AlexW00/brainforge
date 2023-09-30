import { Identifiable } from "../general/Identifiable";

export type ViewProperties = any;

/**
 * A view is a custom UI element.
 */
export abstract class ViewDefinition<P extends ViewProperties>
	implements Identifiable
{
	public abstract readonly id: string;
	public abstract readonly name: string;

	public abstract onLoad: (properties: P, container: ShadowRoot) => void;
	public onUnload: () => void = () => {};
	public onUpdate: (properties: P) => void = () => {};
}
