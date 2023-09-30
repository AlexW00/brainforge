import { defineConfig } from "vite";
import runScript from "./build/vite/run-script";

export default defineConfig({
	// omit
	server: {
		port: 3001,
	},
	plugins: [runScript("build/vite/scripts/index-web-components.js")],
});
