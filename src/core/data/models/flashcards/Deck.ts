import { Identifiable } from "../../../types/general/Identifiable";

export interface Deck extends Identifiable {
	name: string;
	cardsIds: string[];
}
