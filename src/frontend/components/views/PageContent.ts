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
			oldPage.onUnload();
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

	private notifyInfoChanged() {
		if (this.page) {
			this.dispatchEvent(
				new CustomEvent("onInfoChanged", {
					detail: this.page.getInfo(),
				})
			);
		}
	}

	private onPropertiesChanged() {
		if (this.page) {
			this.page.onUpdate(this.properties);
			this.notifyInfoChanged();
		}
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
