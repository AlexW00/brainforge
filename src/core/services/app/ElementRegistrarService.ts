import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import { ModalDefinition } from "../../types/views/ModalDefinition";
import { PageDefinition } from "../../types/views/PageDefinition";

@singleton()
export class ElementRegistrarService {
	constructor(
		@inject(SessionZustandService)
		private readonly sessionZustand: SessionZustandService
	) {}

	public registerModalDefinition(definition: ModalDefinition<any>) {
		this.sessionZustand.state.addModalDefinitions([definition]);
	}

	public registerPageDefinition(definition: PageDefinition<any>) {
		this.sessionZustand.state.addPageDefinitions([definition]);
	}

	public registerCardInputFieldDefinition(definition: any) {
		this.sessionZustand.state.addCardInputFieldDefinitions([definition]);
	}

	public getModalDefinitions() {
		return this.sessionZustand.state.modalDefinitions;
	}

	public getPageDefinitions() {
		return this.sessionZustand.state.pageDefinitions;
	}

	public getCardInputFieldDefinitions() {
		return this.sessionZustand.state.getCardInputFieldDefinitions();
	}

	public getModalDefinitionById(id: string) {
		return this.sessionZustand.state.modalDefinitions.find(
			(definition) => definition.id === id
		);
	}

	public getPageDefinitionById(id: string) {
		return this.sessionZustand.state.pageDefinitions.find(
			(definition) => definition.id === id
		);
	}

	public getCardInputFieldDefinitionById(id: string) {
		return this.sessionZustand.state.getCardInputFieldDefinition(id);
	}
}
