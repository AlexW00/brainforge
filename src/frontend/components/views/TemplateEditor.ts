import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { css, html, unsafeCSS } from "lit";
import ReactDOM from "react-dom/client";
import { Editor } from "../../react/components/organisms/Editor";
import React from "react";
import { container } from "tsyringe";
import rfcss from "reactflow/dist/style.css?inline";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { TemplateNodeService } from "../../../core/services/app/TemplateNodeService";

@customElement("template-editor")
export default class TemplateEditor extends CustomElement {
	constructor() {
		super();
		this.classList.add("container");
	}

	@property({ type: Object })
	template!: Template;

	private editorService = container.resolve(TemplateEditorService);
	private nodeService = container.resolve(TemplateNodeService);

	protected contextMenu = this.nodeService.getAsContextMenu(
		(absolutePosition, nodeDefinition) => {
			const template = this.editorService.getTemplate();
			if (!template) return;

			const editorViewport = template.viewport;

			const thisOffset = this.getBoundingClientRect();

			const positionInEditor = {
				x:
					(absolutePosition.x - thisOffset.x - editorViewport.x) /
					editorViewport.zoom,
				y:
					(absolutePosition.y - thisOffset.y - editorViewport.y) /
					editorViewport.zoom,
			};
			console.log("add node", nodeDefinition, positionInEditor);
			this.editorService.addNode(nodeDefinition.metadata.id, positionInEditor);
		}
	);

	firstUpdated() {
		this.editorService.loadTemplate(this.template);
		const container = this.shadowRoot?.getElementById("react-container");
		if (!container) return;
		const root = ReactDOM.createRoot(container);
		root.render(React.createElement(Editor));
	}

	render() {
		return html`<div id="react-container" class="container"></div>`; // use your React component
	}

	static styles = [
		unsafeCSS(rfcss),
		css`
			.react-flow__handle.connectionindicator {
				margin-top: var(--node-header-height);
			}

			.custom-node-content {
				min-width: 10rem;
			}
			.custom-node-header {
				display: flex;
				justify-content: space-between;
				cursor: grab;
				height: var(--node-header-height);
			}
			.custom-node-header > .title {
				flex: 1;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
			sl-icon-button::part(base) {
				padding: 0;
			}
			.custom-node {
				cursor: default;
			}
			.custom-node:hover {
				box-shadow: var(--sl-shadow-medium);
			}
			.custom-node::part(body) {
				padding: var(--sl-spacing-small);
			}
			.react-flow__node.selected > .custom-node::part(base) {
				border-color: var(--sl-color-primary-500);
			}
			.react-flow__edge.selected > path {
				stroke: var(--sl-color-primary-500) !important;
			}
			.react-flow__edge.selected {
				stroke: var(--sl-color-primary-500) !important;
			}
		`,
	];
}
