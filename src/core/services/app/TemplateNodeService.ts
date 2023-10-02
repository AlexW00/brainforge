import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";

@singleton()
export class TemplateNodeService {
	constructor(
		@inject(SessionZustandService)
		private readonly sessionZustand: SessionZustandService
	) {}

	public getTemplateNode(id: string) {
		return this.sessionZustand.state.getTemplateNodeDefinition(id);
	}

	public getTemplateNodes() {
		return this.sessionZustand.state.getTemplateNodeDefinitions();
	}

	public registerTemplateNode(templateNode: any) {
		this.sessionZustand.state.setTemplateNodeDefinition(templateNode);
	}
}
