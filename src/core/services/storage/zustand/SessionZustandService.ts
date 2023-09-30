import { singleton } from "tsyringe";
import { RibbonItem } from "../../../types/views/RibbonItem";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Observable } from "../../../types/events/Observable";

export interface SessionZustandActions {
	setRibbonItems: (items: RibbonItem[]) => void;
}

export interface SessionZustandState extends SessionZustandActions {
	ribbonItems: RibbonItem[];
}

type EventMap = {
	changed: [newState: SessionZustandState, oldState: SessionZustandState];
};

/**
 * Service for managing device only, non-persisted state.
 */
@singleton()
export class SessionZustandService extends Observable<EventMap> {
	private readonly zustand = createStore(
		immer<SessionZustandState>((set) => ({
			ribbonItems: [],
			setRibbonItems: (items: RibbonItem[]) =>
				set((state) => {
					state.ribbonItems = items;
				}),
		}))
	);

	public state = this.zustand.getState();

	constructor() {
		super();

		this.zustand.subscribe((state, prevState) => {
			this.state = state;
			this.emit("changed", [state, prevState]);
		});
	}
}
