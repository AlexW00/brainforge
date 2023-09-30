import { inject, singleton } from "tsyringe";
import { PluginDefinition } from "../../../../../data/models/extensions/plugins/PluginDefinition";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchPluginService extends PouchMultiDocService<PluginDefinition> {
	protected prefix = "plugin";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
