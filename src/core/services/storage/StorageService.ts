import { inject, singleton } from "@launchtray/tsyringe-async";
import { PouchService } from "./pouch/PouchService";
import { ZustandService } from "./zustand/ZustandService";

@singleton()
export class StorageService {
	constructor(
		@inject(PouchService) public pouch: PouchService,
		@inject(ZustandService) public zustand: ZustandService
	) {}
}
