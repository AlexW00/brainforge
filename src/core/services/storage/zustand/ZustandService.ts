import { inject, singleton } from "tsyringe";
import { PersistedZustandService } from "./PersistedZustandService";
import { SessionZustandService } from "./SessionZustandService";

/**
 * Service for managing:
 * - device only, non-persisted state
 * - device only, persisted state
 * via Zustand.
 */
@singleton()
export class ZustandService {
	constructor(
		@inject(SessionZustandService) public session: SessionZustandService,
		@inject(PersistedZustandService) public persisted: PersistedZustandService
	) {}
}
