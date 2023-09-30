import { inject, singleton } from "tsyringe";
import { Initializeable } from "../../types/general/Initializeable";
import { PouchService } from "./pouch/PouchService";
import { ZustandService } from "./zustand/ZustandService";

@singleton()
export class StorageService implements Initializeable {
	constructor(
		public isInitialized: boolean = false,
		@inject(PouchService) public pouch: PouchService,
		@inject(ZustandService) public zustand: ZustandService
	) {}

	async init() {
		await this.pouch.init();
		this.isInitialized = true;
	}
}
