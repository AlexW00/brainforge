import { PouchDocService } from "./PouchDocService";
import { DEFAULT_USER, User } from "../../../../data/models/User";
import { FactoryFunction, inject, singleton } from "@launchtray/tsyringe-async";
import { DbService } from "../DbService";

@singleton()
export class PouchUserService extends PouchDocService<User> {
	protected getFactory(): FactoryFunction<User> {
		throw new Error("Method not implemented.");
	}

	key: string = "user";
	protected defaultDoc = DEFAULT_USER;

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}
}
