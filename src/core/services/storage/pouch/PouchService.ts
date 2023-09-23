import { inject, singleton } from "@launchtray/tsyringe-async";
import { DbService } from "./DbService";
import { PouchCardService } from "./docs/multi/PouchCardService";
import { PouchDeckService } from "./docs/multi/PouchDeckService";
import { PouchPluginService } from "./docs/multi/PouchPluginService";
import { PouchTemplateService } from "./docs/multi/PouchTemplateService";
import { PouchThemeService } from "./docs/multi/PouchThemeService";
import { PouchPreferencesService } from "./docs/single/PouchPreferencesService";
import { PouchUserService } from "./docs/single/PouchUserService";

/**
 * Service for managing cross-device, persisted state via PouchDB.
 **/
@singleton()
export class PouchService {
	constructor(
		@inject(DbService) protected readonly dbService: DbService,
		// single docs
		@inject(PouchUserService) public readonly userService: PouchUserService,
		@inject(PouchPreferencesService)
		public readonly preferencesService: PouchPreferencesService,
		// multi docs
		@inject(PouchCardService) public readonly cardService: PouchCardService,
		@inject(PouchDeckService) public readonly deckService: PouchDeckService,
		@inject(PouchTemplateService)
		public readonly templateService: PouchTemplateService,
		@inject(PouchPluginService)
		public readonly pluginService: PouchPluginService,
		@inject(PouchThemeService) public readonly themeService: PouchThemeService
	) {}

	clear() {
		return this.dbService.clear();
	}
}
