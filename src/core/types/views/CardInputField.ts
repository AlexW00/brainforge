import { ViewDefinition, ViewProperties } from "./ViewDefinition";

type EventMap<V> = {
	valueChanged: any;
};

export abstract class CardInputFieldDefinition<
	P extends ViewProperties,
	V
> extends ViewDefinition<P, EventMap<V>> {
	onChange = (value: V) => {
		this.emit("valueChanged", {
			id: this.id,
			value,
		});
	};
}
