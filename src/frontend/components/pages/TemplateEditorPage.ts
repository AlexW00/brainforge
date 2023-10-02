import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { css, html } from "lit";
import { container } from "tsyringe";
import { Task, TaskStatus } from "@lit-labs/task";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { choose } from "lit/directives/choose.js";
import { when } from "lit/directives/when.js";

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
		},
		autoRun: false,
	});

	private onTemplateChanged = (_id: string, newValue?: Template) => {
		this.template = newValue;
	};

	onTemplateIdChanged() {
		if (this.properties === undefined) return;

		this.loadTemplateTask.run();
		this.unregisterTemplateChangeListener =
			this.templateService.addChangeListener(this.onTemplateChanged);
	}

	connectedCallback() {
		super.connectedCallback();
		this.onTemplateIdChanged();
	}

	disconnectedCallback() {
		// this.unregisterTemplateChangeListener?.();
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

export class TemplateEditorPageDefinition extends PageDefinition<TemplateEditorPageProperties> {
	id = "template-editor";
	name = "Template Editor";

	private page: TemplateEditorPage;
	private readonly templateService: PouchTemplateService =
		container.resolve(PouchTemplateService);

	onLoad = (
		properties: TemplateEditorPageProperties,
		container: HTMLElement
	) => {
		this.page = new TemplateEditorPage();
		this.page.properties = properties;
		container.appendChild(this.page);
	};

	onUnload = () => {};
	onUpdate = (properties: TemplateEditorPageProperties) => {
		this.page.properties = properties;
	};

	getActions() {
		return [
			{
				id: "add-node",
				title: "Add Node",
				onClick: () => {
					console.log("Add node");
				},
			},
		];
	}
}
