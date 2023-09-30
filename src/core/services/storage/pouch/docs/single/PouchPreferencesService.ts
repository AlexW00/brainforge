import { PouchSingleDocService } from "./PouchSingleDocService";
import {
	DEFAULT_PREFERENCES,
	Preferences,
} from "../../../../../data/models/Preferences";
import { inject, singleton } from "tsyringe";
import { DbService } from "../../DbService";

@singleton()
export class PouchPreferencesService extends PouchSingleDocService<Preferences> {
	key: string = "preferences";
	protected defaultDoc = DEFAULT_PREFERENCES;

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
