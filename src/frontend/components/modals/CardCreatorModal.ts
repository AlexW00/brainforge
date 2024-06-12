import { Task } from "@lit/task";
import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { container } from "tsyringe";
import {
	FilledOutCardInputField,
	newCard,
} from "../../../core/data/models/flashcards/card/Card";
import { Template } from "../../../core/data/models/flashcards/template/Template";
import { TemplateNode } from "../../../core/data/models/flashcards/template/graph/TemplateNode";
import { PouchCardService } from "../../../core/services/storage/pouch/docs/multi/PouchCardService";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";

@customElement("card-creator")
export default class CardCreator extends CustomElement {
	constructor(properties: CardCreatorProps) {
		super();
		if (!properties) throw new Error("Properties must be provided");
		this.properties = properties;
	}

	private readonly templateService = container.resolve(PouchTemplateService);
	private readonly cardService = container.resolve(PouchCardService);
	private readonly deckService = container.resolve(PouchDeckService);

	private readonly properties: CardCreatorProps;

	@state()
	templates: Template[] = [];

	@state()
	selectedTemplateId?: string;

	@state()
	filledOutCardInputFields: FilledOutCardInputField[] = [];

	private selectTemplate = (templateId?: string): boolean => {
		console.log("select template", templateId);
		if (templateId === undefined) return false;
		if (this.templates.find((template) => template.id === templateId)) {
			this.selectedTemplateId = templateId;
			this.filledOutCardInputFields =
				this.getSelectedTemplateInputFields() ?? [];

			return true;
		}
		console.error("Template not found", templateId);
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
		if (selectedTemplate === undefined) return undefined;
		return selectedTemplate.graph.nodes.filter(
			(node) => node.data.definitionId === "input-node"
		);
	};

	private getSelectedTemplateInputFields = ():
		| FilledOutCardInputField[]
		| undefined => {
		const selectedTemplateInputNodes = this.getSelectedTemplateInputNodes();
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

	private close = () => {
		this.dispatchEvent(new CustomEvent("close"));
	};

	private handleSave = () => {
		if (this.selectedTemplateId === undefined) {
			console.error("No template selected");
			return;
		}

		const card = newCard(
			this.selectedTemplateId,
			this.filledOutCardInputFields
		);

		console.log("saving card", card);

		this.cardService
			.set(card)
			.then(() => this.deckService.addCard(this.properties.deckId, card.id))
			.then(() => this.close())
			.catch((e) => {
				console.error(e);
			});
	};

	private handleCancel = () => {
		this.close();
	};

	private handleCardInputFieldsChanged = (
		e: CustomEvent<FilledOutCardInputField[]>
	) => {
		const newFields = e.detail ?? [];
		this.filledOutCardInputFields = [...newFields];
	};

	render() {
		return html`
			<sl-card>
				<card-editor-header
					slot="header"
					@save=${this.handleSave}
					@cancel=${this.handleCancel}
				>
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

export const CARD_CREATOR_MODAL_METADATA: Metadata = {
	id: "card-creator",
	name: "Card Creator",
	description: "A modal that allows the user to create a card",
};

export class CardCreatorModalDefinition extends ModalDefinition<CardCreatorProps> {
	id = CARD_CREATOR_MODAL_METADATA.id;
	name = CARD_CREATOR_MODAL_METADATA.name;
	description = CARD_CREATOR_MODAL_METADATA.description;

	doShowBackground = false;
	public onLoad = (properties: CardCreatorProps, container: HTMLElement) => {
		const settingsModal = new CardCreator(properties);
		container.appendChild(settingsModal);

		settingsModal.addEventListener("close", () => {
			this.close();
		});
	};
}

export const CardCreatorModalDefintitionBundle: IdentifiableConstructor<
	ModalDefinition<CardCreatorProps>,
	Metadata
> = {
	constructor: CardCreatorModalDefinition,
	metadata: CARD_CREATOR_MODAL_METADATA,
};
