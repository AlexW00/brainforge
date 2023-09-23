import { inject, singleton } from "@launchtray/tsyringe-async";
import { Deck } from "../../../../../data/models/flashcards/Deck";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchDeckService extends PouchMultiDocService<Deck> {
	protected prefix = "deck";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
