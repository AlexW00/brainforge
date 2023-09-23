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

	async clear() {
		return this.db.allDocs().then((result) => {
			const deletePromises = result.rows.map((row) => {
				return this.db.remove(row.id, row.value.rev);
			});
			return Promise.all(deletePromises);
		});
	}
}
