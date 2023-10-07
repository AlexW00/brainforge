import { Observable } from "../../../../../types/events/Observable";
import { Identifiable } from "../../../../../types/general/Identifiable";
import { DbService } from "../../DbService";

interface EventMap<T> {
	change: T;
}

/**
 * A multi doc service interacts with multiple documents in the database
 * based on a prefix and an id.
 */
export abstract class PouchMultiDocService<
	T extends Identifiable
> extends Observable<EventMap<T>> {
	protected abstract readonly prefix: string;

	protected abstract readonly dbService: DbService;

	private cancelChangeListener: () => void;

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
		console.log("set", doc);
		const key = this.getKey(doc.id);
		let existingDoc: PouchDB.Core.ExistingDocument<T> | null = null;

		try {
			existingDoc = await this.dbService.getDb().get(key);
		} catch (error: any) {
			if (error.name !== "not_found") {
				throw error; // re-throw the error if it's not a "not found" error
			}
		}
		// circular reference workaround
		const cleanDoc = JSON.parse(JSON.stringify(doc));

		await this.dbService.getDb().put({
			_id: key,
			...cleanDoc,
			_rev: existingDoc?._rev, // use the _rev from the existing document if it exists
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

	public override on<K extends "change">(
		type: K,
		listener: (event: CustomEvent<EventMap<T>[K]>) => void,
		options?: boolean | AddEventListenerOptions | undefined
	): void {
		if (!this.cancelChangeListener) {
			this.dbService
				.getDb()
				.changes({
					since: "now",
					live: true,
					include_docs: true,
				})
				.on("change", (change) => {
					const doc = change.doc as T | undefined,
						id = doc?.id ?? change.id;
					this.dispatchEvent(
						new CustomEvent("change", {
							detail: {
								id,
								...doc,
							},
						})
					);
				});
		}
		super.on(type, listener, options);
	}
}
