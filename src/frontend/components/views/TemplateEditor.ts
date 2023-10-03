import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { css, html, unsafeCSS } from "lit";
import ReactDOM from "react-dom/client";
import { Editor } from "../../react/components/organisms/Editor";
import React from "react";
import { SessionZustandService } from "../../../core/services/storage/zustand/SessionZustandService";
import { container } from "tsyringe";
import rfcss from "reactflow/dist/style.css";

@customElement("template-editor")
export default class TemplateEditor extends CustomElement {
	constructor() {
		super();
		this.classList.add("container");
	}

	@property({ type: Object })
	template!: Template;

	private sessionZustand = container.resolve(SessionZustandService);

	firstUpdated() {
		this.sessionZustand.state.setEditorTemplate(this.template);
		console.log("firstUpdated", this.sessionZustand.state.editorTemplate);
		const container = this.shadowRoot?.getElementById("react-container");
		if (!container) return;
		const root = ReactDOM.createRoot(container);
		root.render(React.createElement(Editor));
	}

	render() {
		return html`<div id="react-container" class="container"></div>`; // use your React component
	}

	static styles = [unsafeCSS(rfcss)];
}
