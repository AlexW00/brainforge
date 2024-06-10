export interface Preferences {
	themeId: string;
	openaiApiKey: string;
	deeplApiKey: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
	themeId: "default",
	openaiApiKey: "",
	deeplApiKey: "",
};
