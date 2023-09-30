import { inject, singleton } from "tsyringe";
import { Template } from "../../../../../data/models/flashcards/template/Template";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchTemplateService extends PouchMultiDocService<Template> {
	protected prefix = "template";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
