import { PouchDocService } from "./PouchDocService";
import {
	DEFAULT_PREFERENCES,
	Preferences,
} from "../../../../data/models/Preferences";
import { inject, singleton } from "@launchtray/tsyringe-async";
import { DbService } from "../DbService";

@singleton()
export class PouchPreferencesService extends PouchDocService<Preferences> {
	key: string = "preferences";
	protected defaultDoc = DEFAULT_PREFERENCES;

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
