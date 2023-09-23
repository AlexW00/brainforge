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

	protected parsePouchDbResult(result: PouchDB.Core.AllDocsResponse<{}>): T[] {
		return result.rows
			.filter((row) => row.doc)
			.map((row) => row.doc as unknown as T);
	}
	/**
	 * Returns the document with the given id.
	 * @param id Id of the document to get
	 * @returns
	 */
	public async get(id: string): Promise<T | undefined> {
		return await this.dbService.getDb().get(this.getKey(id));
	}

	/**
	 * Returns the documents with the given ids.
	 * @param ids Ids of the documents to get
	 * @returns The documents with the given ids
	 */
	public async getMany(ids: string[]): Promise<T[]> {
		const result = await this.dbService.getDb().allDocs({
			include_docs: true,
			keys: ids.map((id) => this.getKey(id)),
		});

		// @todo: UNTESTED
		return this.parsePouchDbResult(result as any);
	}

	/**
	 * Saves the given document to the database.
	 * @param doc Document to set
	 */
	public async set(doc: T): Promise<void> {
		await this.dbService.getDb().put({
			_id: this.getKey(doc.id),
			...doc,
		});
	}

	/**
	 * Deletes the document with the given id.
	 * @param id Id of the document to delete
	 */
	public async delete(id: string): Promise<void> {
		const doc = (await this.get(id)) as any;
		if (!doc) throw new Error("Doc not found");

		await this.dbService.getDb().remove(doc);
	}

	/**
	 * Updates the given document with the given properties.
	 * @param id The id of the document to update
	 * @param changedProps The properties to update
	 */
	public async updateFields(
		id: string,
		changedProps: Partial<T>
	): Promise<void> {
		const doc = await this.get(id);
		if (!doc) throw new Error("Doc not found");

		await this.dbService.getDb().put({
			...doc,
			...changedProps,
		});
	}

	/**
	 * Returns all ids of the documents in this substore.
	 * @returns All ids of the documents in this substore
	 */
	public async getAllIds(): Promise<string[]> {
		const result = await this.dbService.getDb().allDocs({
			include_docs: false,
			startkey: this.getKey(""),
			endkey: this.getKey("\uffff"),
		});

		return result.rows.map((row) => row.id);
	}

	/**
	 * Returns all documents in this substore.
	 * @returns All documents in this substore
	 */
	public async getAll(): Promise<T[]> {
		const result = await this.dbService.getDb().allDocs({
			include_docs: true,
			startkey: this.getKey(""),
			endkey: this.getKey("\uffff"),
		});

		return this.parsePouchDbResult(result);
	}

	/**
	 * Returns the first document that matches the given predicate.
	 * @param predicate Search predicate
	 * @returns The first document that matches the given predicate
	 */
	public async find(predicate: (doc: T) => boolean): Promise<T | undefined> {
		const docs = await this.getAll();
		return docs.find(predicate);
	}

	/**
	 * Returns all documents that match the given predicate.
	 * @param predicate Search predicate
	 * @returns All documents that match the given predicate
	 */
	public async findAll(predicate: (doc: T) => boolean): Promise<T[]> {
		const docs = await this.getAll();
		return docs.filter(predicate);
	}

	/**
	 * Adds a change listener to this substore.
	 * @param listener The listener to add, called with the new document (or undefined if the document was deleted)
	 * @returns A function to remove the listener.
	 */
	public addChangeListener(
		ids: string[],
		listener: (doc?: T) => void
	): () => void {
		return this.dbService
			.getDb()
			.changes({
				since: "now",
				live: true,
				include_docs: true,
				doc_ids: ids,
			})
			.on("change", (change) => {
				const doc = change.doc as T | undefined;
				listener(doc);
			}).cancel;
	}
}
