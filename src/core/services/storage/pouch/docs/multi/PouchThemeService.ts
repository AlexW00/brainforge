import { inject, singleton } from "@launchtray/tsyringe-async";
import { ThemeDefinition } from "../../../../../data/models/extensions/themes/ThemeDefinition";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchThemeService extends PouchMultiDocService<ThemeDefinition> {
	protected prefix = "theme";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
