import { PouchSingleDocService } from "./PouchSingleDocService";
import { inject, singleton } from "tsyringe";
import { User, DEFAULT_USER } from "../../../../../data/models/User";
import { DbService } from "../../DbService";

@singleton()
export class PouchUserService extends PouchSingleDocService<User> {
	key: string = "user";
	protected defaultDoc = DEFAULT_USER;

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
