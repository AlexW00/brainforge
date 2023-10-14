import { customElement, property, state } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";
import { Template } from "../../../core/data/models/flashcards/template/Template";
import { Task } from "@lit-labs/task";
import { container } from "tsyringe";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import { when } from "lit/directives/when.js";
import { TemplateNode } from "../../../core/data/models/flashcards/template/graph/TemplateNode";
import {
	CardInputField,
	FilledOutCardInputField,
} from "../../../core/data/models/flashcards/card/Card";

@customElement("card-creator")
export default class CardCreator extends CustomElement {
	constructor(properties: CardCreatorProps) {
		super();
		if (!properties) throw new Error("Properties must be provided");
		this.properties = properties;
	}

	private readonly templateService = container.resolve(PouchTemplateService);

	private readonly properties: CardCreatorProps;

	@state()
	templates: Template[] = [];

	@state()
	selectedTemplateId?: string;

	@state()
	filledOutCardInputFields: FilledOutCardInputField[] = [];

	private selectTemplate = (templateId?: string): boolean => {
		if (templateId === undefined) return false;
		if (this.templates.find((template) => template.id === templateId)) {
			this.selectedTemplateId = templateId;
			this.filledOutCardInputFields =
				this.getSelectedTemplateInputFields() ?? [];

			return true;
		}
		return false;
	};

	private getSelectedTemplate = (): Template | undefined => {
		if (this.selectedTemplateId === undefined) return undefined;
		return this.templates.find(
			(template) => template.id === this.selectedTemplateId
		);
	};

	private getSelectedTemplateInputNodes = (): TemplateNode[] | undefined => {
		const selectedTemplate = this.getSelectedTemplate();
		console.log("sel temp", selectedTemplate);
		if (selectedTemplate === undefined) return undefined;
		return selectedTemplate.graph.nodes.filter(
			(node) => node.data.definitionId === "input-node"
		);
	};

	private getSelectedTemplateInputFields = ():
		| FilledOutCardInputField[]
		| undefined => {
		const selectedTemplateInputNodes = this.getSelectedTemplateInputNodes();
		console.log(selectedTemplateInputNodes);
		if (selectedTemplateInputNodes === undefined) return undefined;
		return selectedTemplateInputNodes.map((node) => ({
			...node.data.data.inputField,
			value: undefined,
		}));
	};

	private loadTemplatesTask = new Task(
		this,
		async () => {
			const templates = await this.templateService.getAll();
			this.templates = templates;
			console.log(this.properties.templateId, this.selectedTemplateId);
			if (
				this.properties.templateId === undefined &&
				this.selectedTemplateId === undefined
			)
				this.selectTemplate(this.templates[0].id);
			else if (this.selectedTemplateId === undefined)
				this.selectTemplate(this.templates[0].id);
			else this.selectTemplate(this.selectedTemplateId);
		},
		() => []
	);

	private handleCardInputFieldsChanged = (
		e: CustomEvent<FilledOutCardInputField[]>
	) => {
		this.filledOutCardInputFields = e.detail;
	};

	render() {
		return html`
			<sl-card>
				<card-editor-header slot="header">
					<template-select
						slot="center-action"
						.templates=${this.templates}
						.selectedTemplateId=${this.selectedTemplateId}
						@template-select=${(e: CustomEvent<string>) => {
							const templateId = e.detail;
							if (templateId === undefined) return;
							this.selectTemplate(templateId);
						}}
					></template-select>
				</card-editor-header>
				<card-input-editor
					.filledOutCardInputFields=${this.filledOutCardInputFields}
					@cardInputFieldsChanged=${this.handleCardInputFieldsChanged}
				></card-input-editor>
			</sl-card>
		`;
	}

	static styles = css`
		sl-card::part(base) {
			border-radius: var(--sl-border-radius-large);
		}
		sl-card::part(footer) {
			padding: var(--sl-spacing-small);
		}
	`;
}

export type CardCreatorProps = {
	deckId: string;
	templateId?: string;
};

export class CardCreatorModalDefinition extends ModalDefinition<CardCreatorProps> {
	public id = "card-creator";
	public name = "Card Creator";
	doShowBackground = false;
	public onLoad = (properties: CardCreatorProps, container: HTMLElement) => {
		const settingsModal = new CardCreator(properties);
		container.appendChild(settingsModal);
	};
}
