import { inject, singleton } from "tsyringe";
import { ElementRegistrarService } from "./ElementRegistrarService";
import BaseModal from "../../../frontend/components/modals/BaseModal";
import { ViewProperties } from "../../types/views/ViewDefinition";

@singleton()
export class ModalService {
	constructor(
		@inject(ElementRegistrarService)
		private readonly elements: ElementRegistrarService
	) {}

	openModal(modalId: string, properties?: ViewProperties) {
		const definition = this.elements.getModalDefinitionById(modalId);
		if (!definition) {
			throw new Error(`Modal ${modalId} not found, did you register it?`);
		}

		const baseModal = new BaseModal(definition, properties);
		document.body.appendChild(baseModal);
	}
}
