import { defineConfig } from "vite";
import runScript from "./scripts/vite/run-script";

export default defineConfig({
	// omit
	server: {
		port: 3001,
	},
	plugins: [runScript()],
});
