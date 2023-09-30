import { css } from "lit";

// Global css, which applies to all elements
export const globalCss = css`
	:host {
		font-family: "Kollektif", sans-serif;
		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
`;
