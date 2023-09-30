import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import { NavigationStep } from "../../types/views/NavigationStep";
import { ViewProperties } from "../../types/views/ViewDefinition";
import { Observable } from "../../types/events/Observable";

type EventMap = {
	lastStepChanged: [
		newStep: NavigationStep | undefined,
		oldStep: NavigationStep | undefined
	];
};

@singleton()
export class RouterService extends Observable<EventMap> {
	constructor(
		@inject(SessionZustandService)
		private readonly sessionZustand: SessionZustandService
	) {
		super();
		this.sessionZustand.on("changed", (e) => {
			const [state, prevState] = e.detail;
			if (
				state.navigationUndoStack.length !==
				prevState.navigationUndoStack.length
			) {
				this.emit("lastStepChanged", [
					state.navigationUndoStack[state.navigationUndoStack.length - 1],
					prevState.navigationUndoStack[
						prevState.navigationUndoStack.length - 1
					],
				]);
			}
		});
	}

	navigateBack() {
		this.sessionZustand.state.undoNavigationStep();
	}

	navigateForward() {
		this.sessionZustand.state.redoNavigationStep();
	}

	navigateTo(pageId: string, properties: ViewProperties) {
		this.sessionZustand.state.pushNavigationStep({
			pageId,
			properties,
		});
	}

	getLatestStep() {
		return this.sessionZustand.state.navigationUndoStack[0];
	}
}
