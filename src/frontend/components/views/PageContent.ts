import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PropertyValueMap, css } from "lit";
import { PageDefinition } from "../../../core/types/views/PageDefinition";

@customElement("page-content")
export default class PageContent extends CustomElement {
	constructor() {
		super();
		this.classList.add("container");
	}

	@property({ type: Object })
	properties?: any;

	@property({ type: Object })
	page?: PageDefinition<any>;

	private onPageDefinitionChanged(oldPage?: PageDefinition<any>) {
		if (oldPage) {
			if (!this.shadowRoot) return;
			const container = this.shadowRoot.querySelectorAll("div");
			container.forEach((c) => c.remove());
		}

		if (this.page) {
			const container = document.createElement("div");
			this.shadowRoot!.appendChild(container);
			this.page.onLoad(this.properties, container);
		}
	}

	private onPropertiesChanged() {
		if (this.page) this.page.onUpdate(this.properties);
	}

	updated(
		changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		if (changedProperties.has("page")) {
			const oldPage = changedProperties.get("page") as PageDefinition<any>;
			this.onPageDefinitionChanged(oldPage);
		}
		if (changedProperties.has("properties")) {
			this.onPropertiesChanged();
		}
		super.updated(changedProperties);
	}

	static styles = css``;
}
