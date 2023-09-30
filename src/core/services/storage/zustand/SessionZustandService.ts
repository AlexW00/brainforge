import { singleton } from "tsyringe";
import { RibbonItem } from "../../../types/views/RibbonItem";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Observable } from "../../../types/events/Observable";

export interface SessionZustandActions {
	setRibbonItems: (items: RibbonItem[]) => void;
	setLastSelectedDeckId: (deckId: string) => void;
}

export interface SessionZustandState extends SessionZustandActions {
	ribbonItems: RibbonItem[];
	lastSelectedDeckId?: string;
}

type EventMap = {
	changed: [newState: SessionZustandState, oldState: SessionZustandState];
	lastSelectedDeckIdChanged: string | undefined;
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
			setLastSelectedDeckId: (deckId: string) =>
				set((state) => {
					state.lastSelectedDeckId = deckId;
				}),
		}))
	);

	public state = this.zustand.getState();

	constructor() {
		super();

		this.zustand.subscribe((state, prevState) => {
			this.state = state;
			this.emit("changed", [state, prevState]);

			if (state.lastSelectedDeckId !== prevState.lastSelectedDeckId) {
				this.emit("lastSelectedDeckIdChanged", state.lastSelectedDeckId);
			}
		});
	}
}
