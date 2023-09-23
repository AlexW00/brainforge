export abstract class ConstructableService {
	abstract construct(): Promise<void>;
}
