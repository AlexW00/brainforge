import { DbService } from "../DbService";
import { ConstructableService } from "../../../ConstructableService";
import { initializer } from "@launchtray/tsyringe-async";

export abstract class PouchDocService<T> extends ConstructableService {
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
