import { inject, singleton } from "@launchtray/tsyringe-async";
import { Card } from "../../../../../data/models/flashcards/card/Card";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchCardService extends PouchMultiDocService<Card> {
	protected prefix = "card";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
