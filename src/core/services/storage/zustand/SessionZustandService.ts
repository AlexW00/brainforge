import { singleton } from "tsyringe";
import { RibbonItem } from "../../../types/views/RibbonItem";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Observable } from "../../../types/events/Observable";
import { ModalDefinition } from "../../../types/views/ModalDefinition";
import { PageDefinition } from "../../../types/views/PageDefinition";
import { NavigationStep } from "../../../types/views/NavigationStep";

export interface SessionZustandActions {
	setRibbonItems: (items: RibbonItem[]) => void;
	setLastSelectedDeckId: (deckId: string) => void;
	addModalDefinitions: (definitions: ModalDefinition<any>[]) => void;
	addPageDefinitions: (definitions: PageDefinition<any>[]) => void;
	pushNavigationStep: (step: NavigationStep) => void;
	undoNavigationStep: () => void;
	redoNavigationStep: () => void;
}

export interface SessionZustandState extends SessionZustandActions {
	ribbonItems: RibbonItem[];
	lastSelectedDeckId?: string;
	modalDefinitions: ModalDefinition<any>[];
	pageDefinitions: PageDefinition<any>[];
	navigationUndoStack: NavigationStep[];
	navigationRedoStack: NavigationStep[];
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
			modalDefinitions: [],
			pageDefinitions: [],
			navigationUndoStack: [],
			navigationRedoStack: [],
			setRibbonItems: (items: RibbonItem[]) =>
				set((state) => {
					state.ribbonItems = items;
				}),
			setLastSelectedDeckId: (deckId: string) =>
				set((state) => {
					state.lastSelectedDeckId = deckId;
				}),

			addModalDefinitions: (definitions: ModalDefinition<any>[]) =>
				set((state) => {
					const newDefinitions = definitions.filter(
						(definition) =>
							!state.modalDefinitions.some(
								(existingDefinition) => existingDefinition.id === definition.id
							)
					);
					state.modalDefinitions.push(...newDefinitions);
				}),
			addPageDefinitions: (definitions: PageDefinition<any>[]) =>
				set((state) => {
					const newDefinitions = definitions.filter(
						(definition) =>
							!state.pageDefinitions.some(
								(existingDefinition) => existingDefinition.id === definition.id
							)
					);
					state.pageDefinitions.push(...newDefinitions);
				}),
			pushNavigationStep: (step: NavigationStep) =>
				set((state) => {
					state.navigationUndoStack.push(step);
					state.navigationRedoStack = [];
				}),
			undoNavigationStep: () =>
				set((state) => {
					const step = state.navigationUndoStack.pop();
					if (step) {
						state.navigationRedoStack.push(step);
					}
				}),
			redoNavigationStep: () =>
				set((state) => {
					const step = state.navigationRedoStack.pop();
					if (step) {
						state.navigationUndoStack.push(step);
					}
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
