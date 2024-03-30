import { inject, singleton } from "tsyringe";
import { Card, CardRenderCache } from "../../data/models/flashcards/card/Card";
import { Template } from "../../data/models/flashcards/template/Template";
import { TemplateNode } from "../../data/models/flashcards/template/graph/TemplateNode";
import { NodeInputHandleWithValue } from "../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { newDateString } from "../../types/general/DateString";
import { arraysContainSameElements } from "../../util/arraysContainSameElements";
import { PouchCardService } from "../storage/pouch/docs/multi/PouchCardService";
import { PouchTemplateService } from "../storage/pouch/docs/multi/PouchTemplateService";
import { ElementRegistrarService } from "./ElementRegistrarService";
import { LoggerService } from "./LoggerService";

// TODOS:
// check that edge.source and edge.target = nodeId
// check that edge.sourceHandle and edge.targetHandle = name
// check the special output node has an id of "output"
// and an output handle with name "out"

@singleton()
export class CardRenderService {
	constructor(
		@inject(PouchTemplateService) private templateService: PouchTemplateService,
		@inject(PouchCardService) private cardService: PouchCardService,
		@inject(LoggerService) private loggerService: LoggerService,
		@inject(ElementRegistrarService)
		private elementRegistrarService: ElementRegistrarService
	) {}

	/**
	 * Returns (recursively) all input dependencies of a node (including the node itself
	 * @param nodeId The ID of the node.
	 * @param template The template of the card.
	 */
	private async getNodeInputDependencies(
		nodeId: string,
		template: Template
	): Promise<TemplateNode[]> {
		const node = template.graph.nodes.find((node) => node.id === nodeId);
		if (!node) throw new Error(`Node with id ${nodeId} not found`);

		const dependencies: TemplateNode[] = [node];

		const inputEdges = template.graph.edges.filter(
			(edge) => edge.target === nodeId
		);
		for (const edge of inputEdges) {
			const sourceNode = template.graph.nodes.find(
				(node) => node.id === edge.source
			);
			if (!sourceNode)
				throw new Error(`Source node of edge ${edge.id} not found`);

			const sourceNodeDependencies = await this.getNodeInputDependencies(
				sourceNode.id,
				template
			);
			dependencies.push(...sourceNodeDependencies);
		}

		return dependencies;
	}

	/**
	 * Returns all nodes that depend on a node's output (including the node itself).
	 * @param nodeId
	 * @param template
	 */
	private async getNodeOutputDependants(
		nodeId: string,
		template: Template
	): Promise<TemplateNode[]> {
		const node = template.graph.nodes.find((node) => node.id === nodeId);
		if (!node) throw new Error(`Node with id ${nodeId} not found`);

		const dependants: TemplateNode[] = [node];

		const outputEdges = template.graph.edges.filter(
			(edge) => edge.source === nodeId
		);
		for (const edge of outputEdges) {
			const targetNode = template.graph.nodes.find(
				(node) => node.id === edge.target
			);
			if (!targetNode)
				throw new Error(`Target node of edge ${edge.id} not found`);

			const targetNodeDependants = await this.getNodeOutputDependants(
				targetNode.id,
				template
			);
			dependants.push(...targetNodeDependants);
		}

		return dependants;
	}

	/**
	 * Recursively calculates the calue of a node output handle.
	 * @param name The name of the output handle.
	 * @param nodeId The ID of the node.
	 * @param template The template of the card.
	 * @param renderCache The new render cache of the card.
	 */
	private async evaluateOutput(
		name: string,
		nodeId: string,
		template: Template,
		renderCache: CardRenderCache,
		card: Card
	): Promise<any> {
		// Check if the value is already in the cache and return it if it is

		const existingOutputValue = renderCache[nodeId]?.find(
			(handle) => handle.outputName === name
		);
		if (existingOutputValue) {
			this.loggerService.log(
				`Re using old cache for output ${name} of node ${nodeId}`
			);

			return existingOutputValue.value;
		}
		this.loggerService.log(`Calculating output ${name} of node ${nodeId}...`);

		// Otherwise calculate the value
		// Find the node in the template
		const node = template.graph.nodes.find((node) => node.id === nodeId);
		if (!node) throw new Error(`Node with id ${nodeId} not found`);

		if (node.data.definitionId === "input-node") {
			this.loggerService.debug("input node", node);
			const { id, name, inputTypeId } = node.data?.data?.inputField ?? {};

			if (id === undefined) throw new Error("Input node id not found");
			if (name === undefined) throw new Error("Input node name not found");
			if (inputTypeId === undefined)
				throw new Error("Input node input type id not found");

			const inputData = card.inputData;

			if (inputData === undefined) throw new Error("Input data not found");

			const inputField = inputData.find(
				(inputField) =>
					inputField.id === id && inputField.inputTypeId === inputTypeId
			);

			this.loggerService.debug("input field", inputField, inputData);
			if (!renderCache[nodeId]) renderCache[nodeId] = [];
			const dependencies = await this.getNodeInputDependencies(
				nodeId,
				template
			);

			renderCache[nodeId].push({
				outputName: name,
				value: inputField?.value,
				ts: newDateString(),
				dependencies: dependencies.map((node) => node.id),
			});
			return inputField?.value;
		}

		// Evaluate all input handles
		const inputValues: NodeInputHandleWithValue[] = await Promise.all(
			Object.entries(node.data.io?.inputs ?? {}).map(async ([inputName]) => {
				// Find the edge that connects to this input handle
				const input = node.data.io?.inputs[inputName];
				if (!input) {
					throw new Error(
						`Input handle ${inputName} of node ${nodeId} not found`
					);
				}
				const edge = template.graph.edges.find(
					(edge) => edge.target === nodeId && edge.targetHandle === inputName
				);
				if (!edge) {
					return {
						name: inputName,
						value: undefined,
						type: input.type,
					};
				}

				// Recursively evaluate the output handle that this input handle is connected to
				const [sourceNodeId, sourceHandleName] = [
					edge.source,
					edge.sourceHandle,
				];
				if (!sourceNodeId)
					throw new Error(`Source node of edge ${edge.id} not found`);
				if (!sourceHandleName)
					throw new Error(`Source handle of edge ${edge.id} not found`);
				const inputNodeValue = await this.evaluateOutput(
					sourceHandleName,
					sourceNodeId,
					template,
					renderCache,
					card
				);

				return {
					name: inputName,
					value: inputNodeValue,
					type: input.type,
				};
			})
		);
		this.loggerService.debug("input values", inputValues);

		// Calculate the output value
		const outputHandle = node.data.io?.outputs[name];
		if (!outputHandle) {
			this.loggerService.debug(node);
			throw new Error(`Output handle ${name} of node ${nodeId} not found`);
		}

		const NodeDefinition = this.elementRegistrarService.getTemplateNode(
			node.data.definitionId
		);
		if (!NodeDefinition) {
			throw new Error(
				`Node definition ${node.data.definitionId} of node ${nodeId} not found`
			);
		}

		const nodeDefinition = new NodeDefinition.constructor();
		const value = await nodeDefinition.getOutputValue(
			name,
			{ ...node.data, id: nodeId, doCache: true },
			inputValues
		);
		this.loggerService.debug(
			"getOutputValue value",
			value,
			node.data.definitionId
		);

		// Cache the value
		if (!renderCache[nodeId]) renderCache[nodeId] = [];
		const dependencies = await this.getNodeInputDependencies(nodeId, template);
		renderCache[nodeId].push({
			outputName: name,
			value,
			ts: newDateString(),
			dependencies: dependencies.map((node) => node.id),
		});

		this.loggerService.debug("pushed to new render cache", renderCache, nodeId);
		return value;
	}

	/**
	 * Generates a new render cache for a card or returns false if the old cache
	 * is still valid.
	 * @param card The card to generate a new render cache for.
	 * @param template The template of the card.
	 * @returns The new render cache or false if the old cache is still valid.
	 */
	private async generateRenderCache(
		card: Card,
		template: Template
	): Promise<CardRenderCache | false> {
		const oldRenderCache = card.renderCache ?? {};
		this.loggerService.debug("start: old render cache", oldRenderCache);
		// generate a new render cache by cloning all old values that belong
		// to nodes with property doCache = true
		const newRenderCache: CardRenderCache = {};
		let cacheDidNotChange = true;
		const outputNode = template.graph.nodes.find(
			(node) => node.data.definitionId === "output-node"
		);
		if (!outputNode) throw new Error("Output node not found");
		const nodesToEvaluate = await this.getNodeInputDependencies(
			outputNode.id,
			template
		);
		console.log("nodes to evaluate", nodesToEvaluate.length);

		nodesToEvaluate.forEach((node) => {
			const hasCache = oldRenderCache[node.id] !== undefined;
			const doReRunOnRender = node.data.doReRunOnRender;

			// console.log("node", node.id, hasCache, doReRunOnRender);
			if (hasCache && !doReRunOnRender) {
				const ts = oldRenderCache[node.id][0].ts;
				const templateNodeTs = template.graph.nodes.find(
					(n) => n.id === node.id
				)?.data.lastEditTs;

				if (!templateNodeTs || ts > templateNodeTs) {
					newRenderCache[node.id] = oldRenderCache[node.id];
					this.loggerService.debug(`Re using old cache for node ${node.id}`);
				} else {
					this.loggerService.debug(
						"invalidating cache for node since TS outdated",
						templateNodeTs,
						ts
					);
					cacheDidNotChange = false;
				}
			} else {
				this.loggerService.info(
					"invalidating cache for node since no old cache or doReRunOnRender = true",
					node,
					oldRenderCache[node.id],
					node.data.doReRunOnRender
				);
				cacheDidNotChange = false;
			}
		});

		// now, clear re-uesed cache values, which depend on nodes that have no cache anymore
		for (const node of nodesToEvaluate) {
			if (newRenderCache[node.id] === undefined) continue;
			const nodeRenderCache = newRenderCache[node.id];

			const dependencies = await this.getNodeInputDependencies(
				node.id,
				template
			);

			// invalidate, if one of the dependencies has no cache...
			let doInvalidate = dependencies.some(
				(dependency) => newRenderCache[dependency.id] === undefined
			);

			if (!doInvalidate) {
				// or if the dependencies have changed
				const cachedDepenendcies = nodeRenderCache[0].dependencies ?? [];
				doInvalidate = !arraysContainSameElements(
					dependencies.map((d) => d.id),
					cachedDepenendcies
				);
			}

			if (doInvalidate) {
				const dependants = await this.getNodeOutputDependants(
					node.id,
					template
				);
				dependants.forEach((dependant) => {
					delete newRenderCache[dependant.id];
				});
				delete newRenderCache[node.id];
				cacheDidNotChange = false;
			}
		}

		if (cacheDidNotChange) return false;

		this.loggerService.debug(
			"old render cache",
			oldRenderCache,
			cacheDidNotChange
		);

		// evaluate all nodes starting from the output node
		// also provide the new cache so that calculated values can be skipped
		await this.evaluateOutput(
			"out",
			outputNode.id,
			template,
			newRenderCache,
			card
		);
		return newRenderCache;
	}

	/**
	 * Renders a card and updates its render cache.
	 * @param cardId The ID of the card to render.
	 * @returns The HTML of the rendered card.
	 */
	public async renderCard(cardId: string): Promise<string> {
		const card = await this.cardService.get(cardId);
		if (card === undefined) throw new Error(`Card with id ${cardId} not found`);

		const template = await this.templateService.get(card.templateId);
		if (template === undefined)
			throw new Error(`Template with id ${card.templateId} not found`);

		const newRenderCache = await this.generateRenderCache(card, template);
		this.loggerService.debug("new render cache", newRenderCache);

		const outputNodeId = template.graph.nodes.find(
			(node) => node.data.definitionId === "output-node"
		)?.id;
		if (!outputNodeId) throw new Error("Output node not found");

		// keep old cache if no new cache was generated and return old HTML
		if (newRenderCache === false) {
			this.loggerService.debug(
				"keeping old cache, newrendercache false",
				card.renderCache!
			);
			return this.getCardHtml(outputNodeId, card.renderCache!);
		}

		// update card with new cache and return new HTML
		this.loggerService.debug("updating card with new cache", newRenderCache);
		await this.cardService.updateFields(cardId, {
			renderCache: newRenderCache,
		});
		return this.getCardHtml(outputNodeId, newRenderCache);
	}

	/**
	 * Gets the HTML of a card from its render cache.
	 * @param renderCache The render cache of the card.
	 * @returns The HTML of the card.
	 */
	private getCardHtml(
		outputNodeId: string,
		renderCache: CardRenderCache
	): string {
		const outputNodeCache = renderCache[outputNodeId],
			value = outputNodeCache[0].value;
		this.loggerService.debug("output node cache", outputNodeCache);
		return value;
	}
}
