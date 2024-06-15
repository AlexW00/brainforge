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
import { AnyHandle } from "../../../../core/static/nodeHandles/base/AnyHandle";
import { StringHandle } from "../../../../core/static/nodeHandles/base/StringHandle";
import TranslateNode from "./Element";
import { TRANSLATE_NODE_METADATA } from "./Metadata";
import { PouchPreferencesService } from "../../../../core/services/storage/pouch/docs/single/PouchPreferencesService";

export class TranslateNodeDefinition extends TemplateNodeDefinition {
	metadata = TRANSLATE_NODE_METADATA;

	private content: TranslateNode | undefined;
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

		this.content = new TranslateNode();
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

		const lang = params.data.language ?? "English";

		const messages: ChatCompletionMessageParam[] = [
			{
				role: "system",
				content: `You are a translator. The user sends you a text in a foreign language and you have to translate it to ${lang}. ONLY RESPOND WITH THE TRANSLATION IN ${lang.toUpperCase()}. Do not provide any additional information or context. The user will ask for clarification if needed.`,
			},
			{
				role: "user",
				content: prompt,
			},
		];

		const preferences = await this.preferencesService.get();
		console.log("preferences", preferences);
		const apiKey = preferences?.openaiApiKey;

		if (!apiKey) {
			throw new Error("API key is missing");
		}

		if (!lang) {
			throw new Error("Language is missing");
		}

		const ai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		const response = await ai.chat.completions.create({
			model: "gpt-4o",
			messages,
		});

		return response.choices[0].message.content;
	};
}
