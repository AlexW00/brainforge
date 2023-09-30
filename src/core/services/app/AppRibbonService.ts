import { inject, singleton } from "tsyringe";
import { RibbonItem } from "../../types/views/RibbonItem";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import { Observable } from "../../types/events/Observable";

type EventMap = {
	"items-changed": RibbonItem[];
};

@singleton()
export class AppRibbonService extends Observable<EventMap> {
	constructor(
		@inject(SessionZustandService) public zustand: SessionZustandService
	) {
		super();
		this.zustand.on("changed", (e) => {
			const [newState, oldState] = e.detail;
			if (newState.ribbonItems !== oldState.ribbonItems) {
				this.emit("items-changed", newState.ribbonItems);
			}
		});
	}

	addItem(item: RibbonItem) {
		const items = [...this.zustand.state.ribbonItems, item];
		this.zustand.state.setRibbonItems(items);
	}

	removeItem(id: string) {
		const items = this.zustand.state.ribbonItems.filter(
			(item) => item.id !== id
		);
		this.zustand.state.setRibbonItems(items);
	}

	getItems() {
		return this.zustand.state.ribbonItems;
	}
}
