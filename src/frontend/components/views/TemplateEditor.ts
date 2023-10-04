import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { css, html, unsafeCSS } from "lit";
import ReactDOM from "react-dom/client";
import { Editor } from "../../react/components/organisms/Editor";
import React from "react";
import { container } from "tsyringe";
import rfcss from "reactflow/dist/style.css";
import { TemplateEditorService } from "../../../core/services/app/EditorNodeService";
import { TemplateNodeService } from "../../../core/services/app/TemplateNodeService";
import { newTemplateNode } from "../../../core/data/models/flashcards/template/graph/TemplateNode";

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
		(position, nodeDefinition) => {
			console.log("clicked menu item in context");
			this.editorService.addNode(nodeDefinition.id, position);
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
			.title {
				height: 2rem;
				line-height: 2rem;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.3rem;
			}

			.drawer {
				display: flex;
				flex-direction: row;
			}

			.categories,
			.nodes {
				background-color: var(--bg-color);
				border: var(--border-width-small) solid var(--border-color);
				border-radius: var(--border-radius-small);
			}

			.category {
				display: flex;
				flex-grow: 1;
				align-items: center;
			}

			.category.expanded {
				border-right: none;
			}

			.item {
				height: 1.3rem;
				line-height: 1.3rem;
				text-align: left;
				align-items: center;
			}

			.category-name {
				width: 7rem;
			}
			.nodes {
				display: flex;
				flex-direction: column;
				margin-top: 2.3rem;
			}
			.node-name {
				cursor: pointer;
			}
			.nodes.hidden {
				display: none;
			}
		`,
	];
}
