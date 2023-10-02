import { singleton } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

@singleton()
export class DbService {
	private readonly db: PouchDB.Database;

	constructor() {
		this.db = new PouchDB("app");
	}

	getDb(): PouchDB.Database {
		return this.db;
	}

	async clear() {
		return this.db.allDocs().then((result) => {
			const deletePromises = result.rows.map((row) => {
				return this.db.remove(row.id, row.value.rev);
			});
			return Promise.all(deletePromises);
		});
	}

	generateId(): string {
		return uuidv4();
	}
}
