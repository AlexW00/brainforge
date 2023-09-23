import { singleton } from "@launchtray/tsyringe-async";

@singleton()
export class DbService {
	private readonly db: PouchDB.Database;

	constructor() {
		this.db = new PouchDB("app");
	}

	getDb(): PouchDB.Database {
		return this.db;
	}
}
