import { Deck } from "../../../core/data/models/flashcards/Deck";
import { DEFAULT_CARDS } from "./defaultCards";

export const DEFAULT_DECK: Deck = {
	id: "0",
	name: "Default",
	cardsIds: DEFAULT_CARDS.map((card) => card.id),
	childDecksIds: [],
};
