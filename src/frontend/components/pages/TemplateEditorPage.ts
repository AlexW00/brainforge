import { Task, TaskStatus } from "@lit/task";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { when } from "lit/directives/when.js";
import { container } from "tsyringe";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { getRectOfNodes, getTransformForBounds } from "reactflow";
import { toPng } from "html-to-image";
import { UiEventBus } from "../../../core/services/events/UiEventBus";

@customElement("template-editor-page")
export default class TemplateEditorPage extends CustomElement {
	private readonly templateService = container.resolve(PouchTemplateService);

	@property({ type: Object })
	properties: TemplateEditorPageProperties;

	@state()
	private template?: Template;

	constructor() {
		super();
		this.classList.add("container");
	}

	private unregisterTemplateChangeListener: (() => void) | undefined;

	private loadTemplateTask = new Task(this, {
		task: async () => {
			this.template = await this.templateService.get(
				this.properties.templateId
			);
			// emit event
			this.dispatchEvent(
				new CustomEvent("template-loaded", {
					detail: this.template?.name,
				})
			);
		},
		autoRun: false,
	});

	private onTemplateChanged = (e: CustomEvent<Template>) => {
		if (e.detail.id !== this.properties.templateId) return;
		this.template = e.detail;
	};

	onTemplateIdChanged() {
		if (this.properties === undefined) return;
		this.loadTemplateTask.run();
		this.templateService.off("change", this.onTemplateChanged);
		this.templateService.on("change", this.onTemplateChanged);
	}

	connectedCallback() {
		super.connectedCallback();
		this.onTemplateIdChanged();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.templateService.off("change", this.onTemplateChanged);
	}

	update(changedProperties: Map<string | number | symbol, unknown>) {
		if (changedProperties.has("properties")) {
			this.onTemplateIdChanged();
		}
		super.update(changedProperties);
	}

	render() {
		return html`
			${choose(this.loadTemplateTask.status, [
				[TaskStatus.PENDING, () => html`<div>Loading template...</div>`],
				[
					TaskStatus.COMPLETE,
					() =>
						when(
							this.template !== undefined,
							() =>
								html`<template-editor
									.template=${this.template!}
								></template-editor>`
						),
				],
				[TaskStatus.ERROR, () => html`<div>Error loading template</div>`],
			])}
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);
			flex: 1;
		}
	`;
}

type TemplateEditorPageProperties = {
	templateId: string;
};

export const TEMPLATE_EDITOR_PAGE_METADATA: Metadata = {
	id: "template-editor-page",
	name: "Template Editor",
	description: "A page that displays a template editor",
};

export class TemplateEditorPageDefinition extends PageDefinition<TemplateEditorPageProperties> {
	id = TEMPLATE_EDITOR_PAGE_METADATA.id;
	name = TEMPLATE_EDITOR_PAGE_METADATA.name;
	description = TEMPLATE_EDITOR_PAGE_METADATA.description;

	defaultInfo = "Template";

	private page: TemplateEditorPage;
	private readonly editorService = container.resolve(TemplateEditorService);
	private readonly uiEventBus = container.resolve(UiEventBus);

	onLoad = (
		properties: TemplateEditorPageProperties,
		container: HTMLElement
	) => {
		this.page = new TemplateEditorPage();
		this.page.properties = properties;
		container.appendChild(this.page);
		// console.log("load template", properties.templateId);

		this.page.addEventListener(
			"template-loaded",
			this.onTemplateLoaded as EventListener
		);
	};

	private onTemplateLoaded = (e: CustomEvent) => {
		const info = e.detail;
		this.setInfo(info);
	};

	onUnload = () => {};
	onUpdate = (properties: TemplateEditorPageProperties) => {
		this.page.properties = properties;
	};

	getActions() {
		return [
			{
				id: "save-template",
				title: "Save",
				icon: "floppy-disk",
				onClick: async () => {
					this.uiEventBus.emit("save-template", {
						templateId: this.page.properties.templateId,
					});
				},
			},
		];
	}
}

export const TemplateEditorPageDefinitionBundle: IdentifiableConstructor<
	TemplateEditorPageDefinition,
	Metadata
> = {
	constructor: TemplateEditorPageDefinition,
	metadata: TEMPLATE_EDITOR_PAGE_METADATA,
};
