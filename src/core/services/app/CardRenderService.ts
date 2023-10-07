import { inject, singleton } from "tsyringe";
import { Card, CardRenderCache } from "../../data/models/flashcards/card/Card";
import { PouchCardService } from "../storage/pouch/docs/multi/PouchCardService";
import { PouchTemplateService } from "../storage/pouch/docs/multi/PouchTemplateService";
import { Template } from "../../data/models/flashcards/template/Template";
import { LoggerService } from "./LoggerService";
import { ElementRegistrarService } from "./ElementRegistrarService";
import { NodeInputHandleWithValue } from "../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";

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
	 * Recursively calculates the calue of a node output handle.
	 * @param name The name of the output handle.
	 * @param nodeId The ID of the node.
	 * @param template The template of the card.
	 * @param newRenderCache The new render cache of the card.
	 */
	private async evaluateOutput(
		name: string,
		nodeId: string,
		template: Template,
		newRenderCache: CardRenderCache,
		card: Card
	): Promise<any> {
		// Check if the value is already in the cache and return it if it is
		console.log("evaluate output", name, nodeId);
		const existingOutputValue = newRenderCache[nodeId]?.find(
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
			const inputData =
				card.inputData[node.id + "-" + node.data.data.inputTypeId];
			if (inputData === undefined)
				console.error(
					`Input data for input node ${node.id} not found in card ${card.id}`
				);
			return inputData ?? "UNSET";
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
					throw new Error(
						`Edge for input handle ${inputName} of node ${nodeId} not found`
					);
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
					newRenderCache,
					card
				);

				return {
					name: inputName,
					value: inputNodeValue,
					type: input.type,
				};
			})
		);
		console.log("input values", inputValues);

		// Calculate the output value
		const outputHandle = node.data.io?.outputs[name];
		if (!outputHandle) {
			console.log(node);
			throw new Error(`Output handle ${name} of node ${nodeId} not found`);
		}

		const nodeDefintion = this.elementRegistrarService.getTemplateNode(
			node.data.definitionId
		);
		if (!nodeDefintion) {
			throw new Error(
				`Node definition ${node.data.definitionId} of node ${nodeId} not found`
			);
		}

		const value = await nodeDefintion.getOutputValue(
			name,
			{ ...node.data, id: nodeId, doCache: true },
			inputValues
		);
		console.log("getOutputValue value", value, node.data.definitionId);

		// Cache the value
		if (!newRenderCache[nodeId]) newRenderCache[nodeId] = [];
		newRenderCache[nodeId].push({ outputName: name, value, ts: new Date() });

		console.log("new render cache", newRenderCache);
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
		// generate a new render cache by cloning all old values that belong
		// to nodes with property doCache = true
		const newRenderCache: CardRenderCache = {};
		let cacheDidNotChange = true;
		template.graph.nodes.forEach((node) => {
			if (oldRenderCache[node.id] !== undefined && !node.data.doReRunOnRender) {
				const ts = oldRenderCache[node.id][0].ts;
				const templateNodeTs = template.graph.nodes.find(
					(n) => n.id === node.id
				)?.data.lastEditTs;

				if (templateNodeTs && ts > templateNodeTs) {
					newRenderCache[node.id] = oldRenderCache[node.id];
					this.loggerService.debug(`Re using old cache for node ${node.id}`);
				} else {
					cacheDidNotChange = false;
				}
			} else cacheDidNotChange = false;
		});
		if (cacheDidNotChange) return false;

		// evaluate all nodes starting from the output node
		// also provide the new cache so that calculated values can be skipped

		const outputNode = template.graph.nodes.find(
			(node) => node.data.definitionId === "output-node"
		);
		if (!outputNode) throw new Error("Output node not found");

		this.evaluateOutput("out", outputNode.id, template, newRenderCache, card);
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

		const renderCache = await this.generateRenderCache(card, template);
		console.log("render cache", renderCache);

		const outputNodeId = template.graph.nodes.find(
			(node) => node.data.definitionId === "output-node"
		)?.id;
		if (!outputNodeId) throw new Error("Output node not found");

		// keep old cache if no new cache was generated and return old HTML
		if (renderCache === false)
			return this.getCardHtml(outputNodeId, card.renderCache!);

		// update card with new cache and return new HTML
		await this.cardService.updateFields(cardId, { renderCache });
		return this.getCardHtml(outputNodeId, renderCache);
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
		console.log("output node cache", outputNodeCache);
		return value;
	}
}
