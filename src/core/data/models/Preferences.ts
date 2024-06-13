export interface Preferences {
	themeId: string;
	openaiApiKey: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
	themeId: "default",
	openaiApiKey: "",
};
