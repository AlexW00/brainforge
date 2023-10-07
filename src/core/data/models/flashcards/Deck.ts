import { Identifiable } from "../../../types/general/Identifiable";

export interface Deck extends Identifiable {
	name: string;
	cardsIds: string[];
	childDecksIds: string[];
}

// NestedDeck is like a deck but without childDecksIds
// ,instead it has a childDecks property which is an array of NestedDecks
export type NestedDeck = Omit<Deck, "childDecksIds"> & {
	childDecks: NestedDeck[];
};
