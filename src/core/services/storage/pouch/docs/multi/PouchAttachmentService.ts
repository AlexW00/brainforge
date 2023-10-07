import { inject, singleton } from "tsyringe";
import { ThemeDefinition } from "../../../../../data/models/extensions/themes/ThemeDefinition";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";
import { Identifiable } from "../../../../../types/general/Identifiable";

export enum AttachmentType {
	Image = "image/png",
}

export type Attachment = Identifiable & {
	name: string;
	blob: Blob;
	type: AttachmentType;
};

@singleton()
export class PouchAttachmentService extends PouchMultiDocService<Attachment> {
	protected prefix = "attachment";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}

	public override async set(doc: Attachment) {
		const key = this.getKey(doc.id);
		let existingDoc: PouchDB.Core.ExistingDocument<Attachment> | undefined =
			undefined;

		try {
			existingDoc = await this.dbService.getDb().get(key);
		} catch (error: any) {}
		if (existingDoc === undefined) {
			await this.dbService
				.getDb()
				.putAttachment(key, doc.name, doc.blob, doc.type);
			return;
		}

		await this.dbService
			.getDb()
			.putAttachment(key, doc.name, existingDoc._rev, doc.blob, doc.type);
	}
}
