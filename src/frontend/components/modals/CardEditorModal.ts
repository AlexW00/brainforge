import { Task } from "@lit/task";
import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { container } from "tsyringe";
import {
	Card,
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
import { ToastService } from "../../../core/services/app/ToastService";

@customElement("card-editor")
export default class CardEditor extends CustomElement {
	constructor(properties: CardEditorProps) {
		super();
		if (!properties) throw new Error("Properties must be provided");
		this.properties = properties;
	}

	private readonly templateService = container.resolve(PouchTemplateService);
	private readonly cardService = container.resolve(PouchCardService);
	private readonly deckService = container.resolve(PouchDeckService);
	private readonly toastService = container.resolve(ToastService);

	private readonly properties: CardEditorProps;

	@state()
	templates: Template[] = [];

	@state()
	selectedTemplateId?: string;

	@state()
	filledOutCardInputFields: FilledOutCardInputField[] = [];

	@state()
	card: Card | undefined;

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
				this.card?.templateId === undefined &&
				this.selectedTemplateId === undefined
			)
				this.selectTemplate(this.templates[0].id);
			else if (this.selectedTemplateId === undefined)
				this.selectTemplate(this.templates[0].id);
			else this.selectTemplate(this.selectedTemplateId);
		},
		() => []
	);

	private loadCardTask = new Task(
		this,
		async () => {
			this.card = await this.cardService.get(this.properties.cardId);
			console.log("loaded card", this.card);
			this.filledOutCardInputFields = this.card?.inputData ?? [];
			console.log(
				"loaded filled out card input fields",
				this.filledOutCardInputFields
			);
			return this.card;
		},
		() => []
	);

	private close = () => {
		this.dispatchEvent(new CustomEvent("close"));
	};

	private handleCancel = () => {
		this.close();
	};

	private handleSave = () => {
		const templateId = this.selectedTemplateId ?? this.card?.templateId;
		const inputData = this.filledOutCardInputFields;
		if (templateId === undefined) {
			this.toastService.notify(
				"No template selected",
				"error",
				"exclamation-triangle"
			);
		} else {
			const card: Card = {
				...(this.card as Card),
				templateId,
				inputData,
			};
			this.cardService.set(card).then(() => {
				this.toastService.notify("Card saved", "success", "check-circle");
				this.close();
			});
		}
	};

	private handleCardInputFieldsChanged = (
		e: CustomEvent<FilledOutCardInputField[]>
	) => {
		const newFields = e.detail ?? [];
		this.filledOutCardInputFields = [...newFields];
		console.log("fields changed", this.filledOutCardInputFields);
	};

	render() {
		return html`
			<loading-wrapper
				.status=${this.loadCardTask.status}
				errorMessage=${this.loadCardTask.error as string}
			>
				<sl-card class="content" slot="completed">
					<card-editor-header
						slot="header"
						@save=${this.handleSave}
						@cancel=${this.handleCancel}
					>
						<div slot="center-action" class="spacer">Edit card</div>
					</card-editor-header>
					<card-input-editor
						.filledOutCardInputFields=${this.filledOutCardInputFields}
						@cardInputFieldsChanged=${this.handleCardInputFieldsChanged}
					></card-input-editor>
				</sl-card>

				<div class="loading" slot="loading">
					<text-loading-skeleton numberOfLines="4"></text-loading-skeleton>
				</div>
			</loading-wrapper>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: var(--sl-spacing-large);
		}
		.spacer {
			flex-grow: 1;
		}
	`;
}

export type CardEditorProps = {
	cardId: string;
};

export const CARD_EDITOR_MODAL_METADATA: Metadata = {
	id: "card-editor",
	name: "Card Editor",
	description: "A modal that allows the user to edit a card",
};

export class CardEditorModalDefinition extends ModalDefinition<CardEditorProps> {
	id = CARD_EDITOR_MODAL_METADATA.id;
	name = CARD_EDITOR_MODAL_METADATA.name;
	description = CARD_EDITOR_MODAL_METADATA.description;

	doShowBackground = false;
	public onLoad = (properties: CardEditorProps, container: HTMLElement) => {
		const settingsModal = new CardEditor(properties);
		container.appendChild(settingsModal);

		settingsModal.addEventListener("close", () => {
			this.close();
		});
	};
}

export const CardEditorModalDefintitionBundle: IdentifiableConstructor<
	ModalDefinition<CardEditorProps>,
	Metadata
> = {
	constructor: CardEditorModalDefinition,
	metadata: CARD_EDITOR_MODAL_METADATA,
};
