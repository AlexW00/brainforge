export interface Initializeable {
	isInitialized: boolean;
	init(): Promise<void>;
}
