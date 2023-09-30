import { singleton } from "tsyringe";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Observable } from "../../../types/events/Observable";
import { persist } from "zustand/middleware";

export interface PersistedZustandActions {
	setExpandedDeckIds: (ids: string[]) => void;
	toggleExpandedDeckId: (id: string) => void;
}

export interface PersistedZustandState extends PersistedZustandActions {
	expandedDeckIds: string[];
}

type EventMap = {
	changed: [newState: PersistedZustandState, oldState: PersistedZustandState];
	expandedDeckIdsChanged: string[];
};

/**
 * Service for managing device only, non-persisted state.
 */
@singleton()
export class PersistedZustandService extends Observable<EventMap> {
	private readonly zustand = createStore(
		persist(
			immer<PersistedZustandState>((set) => ({
				expandedDeckIds: [],
				setExpandedDeckIds: (ids: string[]) =>
					set((state) => {
						state.expandedDeckIds = ids;
					}),
				toggleExpandedDeckId: (id: string) =>
					set((state) => {
						if (state.expandedDeckIds.includes(id)) {
							state.expandedDeckIds = state.expandedDeckIds.filter(
								(deckId) => deckId !== id
							);
						} else {
							state.expandedDeckIds.push(id);
						}
					}),
			})),
			{
				name: "persisted-zustand",
			}
		)
	);

	public state = this.zustand.getState();

	constructor() {
		super();

		this.zustand.subscribe((state, prevState) => {
			this.state = state;
			this.emit("changed", [state, prevState]);
			if (state.expandedDeckIds !== prevState.expandedDeckIds) {
				this.emit("expandedDeckIdsChanged", state.expandedDeckIds);
			}
		});
	}
}
