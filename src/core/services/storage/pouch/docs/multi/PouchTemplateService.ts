import { inject, singleton } from "tsyringe";
import { Template } from "../../../../../data/models/flashcards/template/Template";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";
import { newTemplateNode } from "../../../../../data/models/flashcards/template/graph/TemplateNode";

@singleton()
export class PouchTemplateService extends PouchMultiDocService<Template> {
	protected prefix = "template";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}

	createNew = async (): Promise<Template> => {
		const template: Template = {
			thumbnail: "",
			id: this.dbService.generateId(),
			name: "New template",
			graph: {
				nodes: [newTemplateNode("output-node", { x: 0, y: 0 })],
				edges: [],
			},
			viewport: {
				x: 0,
				y: 0,
				zoom: 1,
			},
		};
		await this.set(template);
		return template;
	};
}
