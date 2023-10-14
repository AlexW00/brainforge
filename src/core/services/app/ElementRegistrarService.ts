import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import { ModalDefinition } from "../../types/views/ModalDefinition";
import { PageDefinition } from "../../types/views/PageDefinition";
import { TemplateNodeDefinition } from "../../data/models/extensions/plugins/templates/TemplateNodeDefinition";
import {
	ContextMenu,
	ContextMenuEntry,
} from "../../types/views/ContextMenuItem";
import { Position } from "../../types/general/Position";

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

	public registerTemplateNode(templateNode: any) {
		this.sessionZustand.state.setTemplateNodeDefinition(templateNode);
	}

	public getModalDefinitions() {
		return this.sessionZustand.state.modalDefinitions;
	}

	public getPageDefinitions() {
		return this.sessionZustand.state.pageDefinitions;
	}

	public getCardInputFieldDefinitions() {
		return this.sessionZustand.state
			.getCardInputFieldDefinitions()
			.map((definition) => definition);
	}

	public getTemplateNode(id: string) {
		return this.sessionZustand.state.getTemplateNodeDefinition(id);
	}

	public getTemplateNodes() {
		return this.sessionZustand.state.getTemplateNodeDefinitions();
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

	getTemplateNodesAsContextMenu(
		onClickItem: (position: Position, node: TemplateNodeDefinition) => void
	): ContextMenu {
		const nodes = this.getTemplateNodes();
		const categories = nodes
			.map((node) => node.metadata.category)
			.filter((value, index, self) => self.indexOf(value) === index);

		const entries: ContextMenuEntry[] = categories.map((category) => {
			const categoryNodes = nodes.filter(
				(node) => node.metadata.category === category
			);
			return {
				title: category,
				items: categoryNodes.map((node) => ({
					title: node.metadata.name,
					onClick: (position) => onClickItem(position, node),
				})),
			};
		});
		return { entries };
	}
}
