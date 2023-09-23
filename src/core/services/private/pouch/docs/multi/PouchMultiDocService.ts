import { Identifiable } from "../../../../../types/Identifiable";
import { DbService } from "../../DbService";

/**
 * A multi doc service interacts with multiple documents in the database
 * based on a prefix and an id.
 */
export abstract class PouchMultiDocService<T extends Identifiable> {
	protected abstract readonly prefix: string;

	protected abstract readonly dbService: DbService;

	protected getKey(id: string): string {
		return `${this.prefix}:${id}`;
	}

	public async getDoc(id: string): Promise<T | undefined> {
		return await this.dbService.getDb().get(this.getKey(id));
	}

	public async setDoc(doc: T): Promise<void> {
		await this.dbService.getDb().put({
			_id: this.getKey(doc.id),
			...doc,
		});
	}
}
