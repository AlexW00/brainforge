import { defineConfig } from "vite";
import runScript from "./build/vite/run-script";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	server: {
		port: 3001,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "node_modules/@shoelace-style/shoelace/dist/assets/icons/*.svg",
					dest: "shoelace/assets/icons",
				},
				{
					src: "node_modules/@phosphor-icons/core/assets/",
					dest: "phosphor-icons/core/",
				},
			],
		}),
		runScript("build/vite/scripts/index-web-components.js"),
	],
});
