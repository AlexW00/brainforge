import { initializer } from "@launchtray/tsyringe-async";
import { ConstructableService } from "../../../../ConstructableService";
import { DbService } from "../../DbService";

/**
 * A single store service only interacts with a single document in the database.
 */
export abstract class PouchSingleDocService<T> extends ConstructableService {
	public abstract readonly key: string;

	protected abstract readonly dbService: DbService;
	protected abstract readonly defaultDoc: T;

	@initializer()
	async construct() {
		try {
			await this.getDoc();
		} catch (err: any) {
			if (err.status === 404) {
				await this.setDoc(this.defaultDoc);
			} else {
				throw err;
			}
		}
	}

	public async getDoc(): Promise<T | undefined> {
		return await this.dbService.getDb().get(this.key);
	}

	public async setDoc(doc: T): Promise<void> {
		await this.dbService.getDb().put({
			_id: this.key,
			...doc,
		});
	}
}
