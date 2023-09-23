import { Inject, Service } from "typedi";
import { ConstructableService } from "./ConstructableService";

@Service()
class ServiceFactory<T extends ConstructableService> {
	@Inject()
	private service!: T;

	async create() {
		await this.service.construct();
		return this.service;
	}
}

export const serviceFactory = () => {};
