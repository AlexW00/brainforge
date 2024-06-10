import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { container } from "tsyringe";
import { TemplateNodeDefinition } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeParams } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import {
	NodeHandles,
	NodeInputHandle,
	NodeInputHandleWithValue,
	NodeOutputHandle,
} from "../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { TemplateEditorService } from "../../../../core/services/app/TemplateEditorService";
import { AnyHandle } from "../../../../core/static/nodeHandles/base/AnyHandle";
import { StringHandle } from "../../../../core/static/nodeHandles/base/StringHandle";
import OpenAiNode from "./Element";
import { OPENAI_NODE_METADATA } from "./Metadata";
import { PouchPreferencesService } from "../../../../core/services/storage/pouch/docs/single/PouchPreferencesService";

export class OpenAiNodeDefinition extends TemplateNodeDefinition {
	metadata = OPENAI_NODE_METADATA;

	private content: OpenAiNode | undefined;
	private readonly templateEditor = container.resolve(TemplateEditorService);
	private readonly preferencesService = container.resolve(
		PouchPreferencesService
	);

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		if (params.inputHandles === undefined) {
			const inputHandles: NodeHandles<NodeInputHandle> = {
				prompt: {
					name: "prompt",
					type: AnyHandle,
				},
			};
			this.nodeService.setInputHandles(params.id, inputHandles);
		}

		if (params.outputHandles === undefined) {
			const outputHandles: NodeHandles<NodeOutputHandle> = {
				result: {
					name: "result",
					type: StringHandle,
				},
			};

			this.nodeService.setOutputHandles(params.id, outputHandles);
		}

		this.content = new OpenAiNode();
		this.content.params = params;

		parent.appendChild(this.content);
	};

	onUpdate = (params: TemplateNodeParams) => {
		if (!this.content) return;
		this.content.params = params;
		console.log("Updated with params", params);
	};

	getOutputValue = async (
		outputId: string,
		params: TemplateNodeParams,
		inputs: NodeInputHandleWithValue[]
	) => {
		const prompt: string =
			inputs.find((input) => input.name === "prompt")?.value ?? "";

		const messages: ChatCompletionMessageParam[] = [
			{
				role: "system",
				content: "You are a helpful assistant.",
			},
			{
				role: "user",
				content: prompt,
			},
		];

		const apiKey = (await this.preferencesService.get())?.openaiApiKey;
		const model = params.data.model;

		if (!apiKey) {
			throw new Error("API key is missing");
		}

		if (!model) {
			throw new Error("Model is missing");
		}

		const ai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		const response = await ai.chat.completions.create({
			model,
			messages,
		});

		return response.choices[0].message.content;
	};
}
