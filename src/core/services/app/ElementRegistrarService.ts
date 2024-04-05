import { inject, singleton } from "tsyringe";
import { TemplateNodeDefinition } from "../../data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../data/models/extensions/plugins/templates/TemplateNodeMetadata";
import { IdentifiableConstructor } from "../../types/general/Constructor";
import { Metadata } from "../../types/general/Metadata";
import { Position } from "../../types/general/Position";
import { CardInputFieldDefinition } from "../../types/views/CardInputField";
import {
	ContextMenu,
	ContextMenuEntry,
} from "../../types/views/ContextMenuItem";
import { ModalDefinition } from "../../types/views/ModalDefinition";
import { PageDefinition } from "../../types/views/PageDefinition";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";

@singleton()
export class ElementRegistrarService {
	constructor(
		@inject(SessionZustandService)
		private readonly sessionZustand: SessionZustandService
	) {}

	public registerModalDefinition(
		definition: IdentifiableConstructor<ModalDefinition<any>, Metadata>
	) {
		this.sessionZustand.state.addModalDefinitions([definition]);
	}

	public registerPageDefinition(
		definition: IdentifiableConstructor<PageDefinition<any>, Metadata>
	) {
		this.sessionZustand.state.addPageDefinitions([definition]);
	}

	public registerCardInputFieldDefinition(
		definition: IdentifiableConstructor<
			CardInputFieldDefinition<any, any>,
			Metadata
		>
	) {
		this.sessionZustand.state.addCardInputFieldDefinitions([definition]);
	}

	public registerTemplateNode(
		templateNode: IdentifiableConstructor<
			TemplateNodeDefinition,
			TemplateNodeMetadata
		>
	) {
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
			(definition) => definition.metadata.id === id
		);
	}

	public getPageDefinitionById(id: string) {
		console.log(
			"looking for ",
			id,
			" in ",
			this.sessionZustand.state.pageDefinitions
		);
		return this.sessionZustand.state.pageDefinitions.find(
			(definition) => definition.metadata.id === id
		);
	}

	public getCardInputFieldDefinitionById(id: string) {
		return this.sessionZustand.state.getCardInputFieldDefinition(id);
	}

	getTemplateNodesAsContextMenu(
		onClickItem: (
			position: Position,
			node: IdentifiableConstructor<
				TemplateNodeDefinition,
				TemplateNodeMetadata
			>
		) => void
	): ContextMenu {
		const nodes = this.getTemplateNodes();
		const categories = nodes
			.map((node) => node.metadata.category)
			.filter((value, index, self) => self.indexOf(value) === index)
			.filter((value) => value !== "hidden");

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
