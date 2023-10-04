import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import {
	ContextMenu,
	ContextMenuEntry,
} from "../../types/views/ContextMenuItem";
import { TemplateNodeDefinition } from "../../data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { Position } from "../../types/general/Position";

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

	getAsContextMenu(
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
