import * as UiEventDefinitions from "../static/events/ui";

export type UiEventDataMap = {
	[K in keyof typeof UiEventDefinitions as `${string &
		K}Event`]: (typeof UiEventDefinitions)[K];
};
