import { inject, singleton } from "@launchtray/tsyringe-async";
import { PouchService } from "./pouch/PouchService";

@singleton()
export class StorageService {
	constructor(@inject(PouchService) public pouch: PouchService) {}
}
