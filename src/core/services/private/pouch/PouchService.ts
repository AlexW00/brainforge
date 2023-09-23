import { inject, singleton } from "@launchtray/tsyringe-async";
import { PouchUserService } from "./docs/PouchUserService";
import { PouchPreferencesService } from "./docs/PouchPreferencesService";

@singleton()
export class PouchService {
	constructor(
		@inject(PouchUserService) public readonly userService: PouchUserService,
		@inject(PouchPreferencesService)
		public readonly preferencesService: PouchPreferencesService
	) {}

	hello() {
		console.log("hello");
	}
}
