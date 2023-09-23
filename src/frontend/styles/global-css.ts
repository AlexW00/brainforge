import { css } from "lit";

// Global css, which applies to all elements
export const globalCss = css`
	:host {
		color-scheme: light dark;
		font-family: "IBM Plex Mono", monospace;
		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}
`;
