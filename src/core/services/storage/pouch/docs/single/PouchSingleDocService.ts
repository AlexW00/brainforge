import { Initializeable } from "../../../../../types/general/Initializeable";
import { DbService } from "../../DbService";

/**
 * A single store service only interacts with a single document in the database.
 */
export abstract class PouchSingleDocService<T> implements Initializeable {
	public abstract readonly key: string;

	protected abstract readonly dbService: DbService;
	protected abstract readonly defaultDoc: T;

	isInitialized: boolean = false;

	async init() {
		try {
			await this.get();
		} catch (err: any) {
			if (err.status === 404) {
				await this.set(this.defaultDoc);
				this.isInitialized = true;
			} else {
				throw err;
			}
		}
	}

	/**
	 * Returns the document of this substore.
	 * @returns The document of this substore.
	 */
	public async get(): Promise<T | undefined> {
		return await this.dbService.getDb().get(this.key);
	}

	/**
	 * Saves the given document to this substore.
	 * @param doc New substore document
	 */
	public async set(doc: T): Promise<void> {
		await this.dbService.getDb().put({
			_id: this.key,
			...doc,
		});
	}

	/**
	 * Updates the document of this substore with the given properties.
	 * @param changedProps The properties to update
	 */
	public async updateFields(changedProps: Partial<T>): Promise<void> {
		const doc = await this.get();
		if (!doc) throw new Error("Doc not found");

		await this.dbService.getDb().put({
			...doc,
			...changedProps,
		});
	}

	/**
	 * Adds a change listener to this substore.
	 * @param listener The listener to add, called with the new document (or undefined if the document was deleted)
	 * @returns A function to remove the listener.
	 */
	public addChangeListener(listener: (doc?: T) => void): () => void {
		return this.dbService
			.getDb()
			.changes({
				since: "now",
				live: true,
				include_docs: true,
				doc_ids: [this.key],
			})
			.on("change", (change) => {
				const doc = change.doc as T | undefined;
				listener(doc);
			}).cancel;
	}
}
