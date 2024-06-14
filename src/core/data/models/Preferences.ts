import { PrimaryColor } from "../../types/views/PrimaryColor";

export interface Preferences {
	primaryColor: PrimaryColor;
	openaiApiKey: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
	primaryColor: PrimaryColor.pink,
	openaiApiKey: "",
};
