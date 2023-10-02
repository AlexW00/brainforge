import { singleton } from "tsyringe";
import { RibbonItem } from "../../../types/views/RibbonItem";
import { create, createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Observable } from "../../../types/events/Observable";
import { ModalDefinition } from "../../../types/views/ModalDefinition";
import { PageDefinition } from "../../../types/views/PageDefinition";
import { NavigationStep } from "../../../types/views/NavigationStep";
import { Template } from "../../../data/models/flashcards/template/Template";
import { TemplateEdge } from "../../../data/models/flashcards/template/graph/TemplateEdge";
import { TemplateNode } from "../../../data/models/flashcards/template/graph/TemplateNode";
import { NodeData } from "../../../data/models/flashcards/template/graph/nodeData/NodeData";
import {
	NodeHandles,
	NodeOutputHandleValueFunction,
} from "../../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import NodeHandleType from "../../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandleType";
import {
	Connection,
	EdgeChange,
	NodeChange,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from "reactflow";
import { TemplateNodeDefinition } from "../../../data/models/extensions/plugins/templates/TemplateNodeDefinition";

export interface SessionZustandActions {
	setRibbonItems: (items: RibbonItem[]) => void;
	setLastSelectedDeckId: (deckId: string) => void;
	addModalDefinitions: (definitions: ModalDefinition<any>[]) => void;
	addPageDefinitions: (definitions: PageDefinition<any>[]) => void;
	setTemplateNodeDefinition: (definition: TemplateNodeDefinition) => void;
	getTemplateNodeDefinition: (id: string) => TemplateNodeDefinition | undefined;
	getTemplateNodeDefinitions: () => TemplateNodeDefinition[];

	pushNavigationStep: (step: NavigationStep) => void;
	undoNavigationStep: () => void;
	redoNavigationStep: () => void;

	setEditorTemplate: (template: Template | undefined) => void;
	setNodeData: (nodeId: string, data: NodeData) => void;
	setNodeDataData: (nodeId: string, data: any) => void;
	setNodeCaching: (nodeId: string, doCache: boolean) => void;
	setEdges: (edges: TemplateEdge[]) => void;
}

export interface SessionZustandState extends SessionZustandActions {
	ribbonItems: RibbonItem[];
	lastSelectedDeckId?: string;
	modalDefinitions: ModalDefinition<any>[];
	pageDefinitions: PageDefinition<any>[];
	templateNodeDefinitions: Map<string, TemplateNodeDefinition>;
	navigationUndoStack: NavigationStep[];
	navigationRedoStack: NavigationStep[];
	editorTemplate: Template | undefined;

	getEdges: () => TemplateEdge[];
	getNodes: () => TemplateNode[];
	setNodeData: (nodeId: string, data: NodeData) => void;
	setNodeHandles: (
		nodeId: string,
		isInput: boolean,
		handles: NodeHandles<any>
	) => void;
	setNodeHandleType: (
		nodeId: string,
		isInput: boolean,
		name: string,
		type: NodeHandleType
	) => void;

	setNodes: (nodes: TemplateNode[]) => void;
	setOutputData: (
		nodeId: string,
		outputId: string,
		data: NodeOutputHandleValueFunction
	) => void;

	onNodesChange: (nodeChanges: NodeChange[]) => void;
	onEdgesChange: (edgeChanges: EdgeChange[]) => void;
	onConnect: (connection: Connection) => void;
}

type EventMap = {
	changed: [newState: SessionZustandState, oldState: SessionZustandState];
	lastSelectedDeckIdChanged: string | undefined;
};

/**
 * Service for managing device only, non-persisted state.
 */
@singleton()
export class SessionZustandService extends Observable<EventMap> {
	public readonly zustand = create(
		immer<SessionZustandState>((set, get) => ({
			ribbonItems: [],
			modalDefinitions: [],
			pageDefinitions: [],
			templateNodeDefinitions: new Map(),
			navigationUndoStack: [],
			navigationRedoStack: [],
			editorTemplate: undefined,
			setRibbonItems: (items: RibbonItem[]) =>
				set((state) => {
					state.ribbonItems = items;
				}),
			setLastSelectedDeckId: (deckId: string) =>
				set((state) => {
					state.lastSelectedDeckId = deckId;
				}),

			addModalDefinitions: (definitions: ModalDefinition<any>[]) =>
				set((state) => {
					const newDefinitions = definitions.filter(
						(definition) =>
							!state.modalDefinitions.some(
								(existingDefinition) => existingDefinition.id === definition.id
							)
					);
					state.modalDefinitions.push(...newDefinitions);
				}),
			addPageDefinitions: (definitions: PageDefinition<any>[]) =>
				set((state) => {
					const newDefinitions = definitions.filter(
						(definition) =>
							!state.pageDefinitions.some(
								(existingDefinition) => existingDefinition.id === definition.id
							)
					);
					state.pageDefinitions.push(...newDefinitions);
				}),
			pushNavigationStep: (step: NavigationStep) =>
				set((state) => {
					state.navigationUndoStack.push(step);
					state.navigationRedoStack = [];
				}),
			undoNavigationStep: () =>
				set((state) => {
					// if (state.navigationUndoStack.length <= 1) return;
					const step = state.navigationUndoStack.pop();
					if (step) {
						state.navigationRedoStack.push(step);
					}
				}),
			redoNavigationStep: () =>
				set((state) => {
					const step = state.navigationRedoStack.pop();
					if (step) {
						state.navigationUndoStack.push(step);
					}
				}),

			setTemplateNodeDefinition: (definition: TemplateNodeDefinition) => {
				set((state) => {
					state.templateNodeDefinitions.set(definition.metadata.id, definition);
				});
			},

			getTemplateNodeDefinition: (id: string) => {
				return get().templateNodeDefinitions.get(id);
			},

			getTemplateNodeDefinitions: () => {
				return Array.from(get().templateNodeDefinitions.values());
			},

			setEditorTemplate: (template: Template | undefined) =>
				set((state) => {
					state.editorTemplate = template;
				}),

			getEdges: () => {
				return get().editorTemplate?.graph.edges ?? [];
			},
			getNodes: () => {
				return get().editorTemplate?.graph.nodes ?? [];
			},

			setNodeData: (nodeId: string, data: NodeData) =>
				set((state) => {
					const node = state.editorTemplate?.graph.nodes.find(
						(node) => node.id === nodeId
					);
					if (!node) return;

					node.data = data;
				}),

			setNodeDataData: (nodeId: string, data: any) =>
				set((state) => {
					const node = state.editorTemplate?.graph.nodes.find(
						(node) => node.id === nodeId
					);
					if (!node) return;

					node.data.data = data;
				}),

			setNodeCaching: (nodeId: string, doCache: boolean) =>
				set((state) => {
					const node = state.editorTemplate?.graph.nodes.find(
						(node) => node.id === nodeId
					);
					if (!node) return;

					node.data.doReRunOnRender = !doCache;
				}),

			setNodeHandles: (
				nodeId: string,
				isInput: boolean,
				handles: NodeHandles<any>
			) =>
				set((state) => {
					const node = state.editorTemplate?.graph.nodes.find(
						(node) => node.id === nodeId
					);
					if (!node) return;

					if (isInput) {
						node.data.io.inputs = handles;
					} else {
						node.data.io.outputs = handles;
					}
				}),

			setNodeHandleType: (
				nodeId: string,
				isInput: boolean,
				name: string,
				type: NodeHandleType
			) =>
				set((state) => {
					const node = state.editorTemplate?.graph.nodes.find(
						(node) => node.id === nodeId
					);
					if (!node) return;

					if (isInput) {
						node.data.io.inputs[name].type = type;
					} else {
						node.data.io.outputs[name].type = type;
					}
				}),

			setEdges: (edges: TemplateEdge[]) =>
				set((state) => {
					state.editorTemplate?.graph.edges.splice(0);
					state.editorTemplate?.graph.edges.push(...edges);
				}),

			setNodes: (nodes: TemplateNode[]) =>
				set((state) => {
					state.editorTemplate?.graph.nodes.splice(0);
					state.editorTemplate?.graph.nodes.push(...nodes);
				}),

			setOutputData: (
				nodeId: string,
				outputId: string,
				data: NodeOutputHandleValueFunction
			) =>
				set((state) => {
					const node = state.editorTemplate?.graph.nodes.find(
						(node) => node.id === nodeId
					);
					if (!node) return;

					node.data.io.outputs[outputId].getValue = data;
				}),

			onNodesChange: (changes: NodeChange[]) => {
				const newNodes = applyNodeChanges(changes, this.state.getNodes());
				this.state.setNodes(newNodes);
			},

			onEdgesChange: (changes: EdgeChange[]) => {
				const newEdges = applyEdgeChanges(changes, this.state.getEdges());
				this.state.setEdges(newEdges);
			},

			onConnect: (connection: Connection) => {
				const newEdge = addEdge(connection, this.state.getEdges());
				this.state.setEdges(newEdge);
			},
		}))
	);

	public state = this.zustand.getState();

	constructor() {
		super();

		this.zustand.subscribe((state, prevState) => {
			this.state = state;
			this.emit("changed", [state, prevState]);

			if (state.lastSelectedDeckId !== prevState.lastSelectedDeckId) {
				this.emit("lastSelectedDeckIdChanged", state.lastSelectedDeckId);
			}
		});
	}
}
