import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
	NodeOutputHandleValue,
} from "../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { Template } from "../../data/models/flashcards/template/Template";
import { PouchTemplateService } from "../storage/pouch/docs/multi/PouchTemplateService";
import {
	TemplateNode,
	newTemplateNode,
} from "../../data/models/flashcards/template/graph/TemplateNode";
import { Position } from "../../types/general/Position";
import { getUniqueKeyForObject } from "../../util/getUniqueKeyForObject";

@singleton()
export class TemplateEditorService {
	constructor(
		@inject(SessionZustandService)
		private readonly sessionZustand: SessionZustandService,
		@inject(PouchTemplateService)
		private readonly templateService: PouchTemplateService
	) {}

	loadTemplate(template: Template) {
		this.sessionZustand.state.setEditorTemplate(template);
	}

	getTemplate() {
		return this.sessionZustand.state.editorTemplate;
	}

	clearTemplate() {
		this.sessionZustand.state.setEditorTemplate(undefined);
	}

	async saveTemplate() {
		if (this.sessionZustand.state.editorTemplate === undefined)
			throw new Error("No template loaded");

		this.templateService.set(this.sessionZustand.state.editorTemplate);
	}

	addNode(nodeDefinitionId: string, position: Position) {
		const node: TemplateNode = newTemplateNode(nodeDefinitionId, position);
		this.sessionZustand.state.pushNode(node);
	}

	addNewInputHandle(nodeId: string, prefix = "Input") {
		const node = this.sessionZustand.state
			.getNodes()
			.find((n) => n.id === nodeId);
		if (node === undefined) throw new Error("Node not found");
		const inputHandles: any = { ...node.data.io?.inputs };
		console.log("input handles", inputHandles);
		const key = getUniqueKeyForObject(
			inputHandles,
			prefix,
			Object.keys(inputHandles).length + 1
		);
		const [name, index] = key.split("-");
		inputHandles[key] = {
			name: `${name}${index !== undefined ? ` ${index}` : ""}`,
			type: "any",
		};

		this.sessionZustand.state.setNodeHandles(nodeId, true, inputHandles);
	}

	setOutputHandles = (
		nodeId: string,
		handles: NodeHandles<NodeOutputHandle>
	) => {
		this.sessionZustand.state.setNodeHandles(nodeId, false, handles);
	};

	setInputHandles = (nodeId: string, handles: NodeHandles<NodeInputHandle>) => {
		this.sessionZustand.state.setNodeHandles(nodeId, true, handles);
	};

	setData(nodeId: string, data: any) {
		this.sessionZustand.state.setNodeDataData(nodeId, data);
	}

	setDoCache(nodeId: string, doCache: boolean) {
		this.sessionZustand.state.setNodeCaching(nodeId, doCache);
	}

	setOutputHandleValue(
		nodeId: string,
		handleId: string,
		value: NodeOutputHandleValue
	) {
		this.sessionZustand.state.setOutputValue(nodeId, handleId, value);
	}
}
