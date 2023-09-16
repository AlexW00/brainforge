import { customElement } from "lit/decorators.js";
import { EucideElement } from "./Component.js";

@customElement("test-component")
export default class TestElement extends EucideElement {
	render() {
		return "Hello World";
	}
}
