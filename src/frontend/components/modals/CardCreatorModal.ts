import { customElement, property, state } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { html } from "lit";
import { Template } from "../../../core/data/models/flashcards/template/Template";
import { Task } from "@lit-labs/task";
import { container } from "tsyringe";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import { when } from "lit/directives/when.js";

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

	private selectTemplate = (templateId?: string): boolean => {
		if (templateId === undefined) return false;
		if (this.templates.find((template) => template.id === templateId)) {
			this.selectedTemplateId = templateId;
			return true;
		}
		return false;
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

	render() {
		return html`
			<template-select
				.templates=${this.templates}
				.selectedTemplateId=${this.selectedTemplateId}
				@template-select=${(e: CustomEvent<string>) => {
					const templateId = e.detail;
					if (templateId === undefined) return;
					this.selectTemplate(templateId);
				}}
			></template-select>
			${when(
				this.selectedTemplateId !== undefined,
				() => html`inputs`,
				() => html``
			)}
		`;
	}
}

export type CardCreatorProps = {
	deckId: string;
	templateId?: string;
};

export class CardCreatorModalDefinition extends ModalDefinition<CardCreatorProps> {
	public id = "card-creator";
	public name = "Card Creator";
	public onLoad = (properties: CardCreatorProps, container: HTMLElement) => {
		const settingsModal = new CardCreator(properties);
		container.appendChild(settingsModal);
	};
}
