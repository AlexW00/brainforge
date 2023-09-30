import fs from "fs";
import path from "path";

/**
 * Generates an index.ts file for a directory
 * @param {string} eventsDir Directory to generate index.ts for
 */
export const indexExports = (eventsDir) => {
	// if no argument, exit
	if (!eventsDir) {
		console.log("NO EVENT DIRECTORY PROVIDED");
		process.exit(1);
	}

	const files = fs.readdirSync(eventsDir);
	const exports = files
		.filter((file) => file.endsWith(".ts") && file !== "index.ts")
		.map((file) => `export * from './${file.replace(".ts", "")}';`)
		.join("\n");

	const numExports = exports.split("\n").length;

	console.log(`[INDEXER] Generated ${numExports} exports for ${eventsDir}`);

	fs.writeFileSync(path.join(eventsDir, "index.ts"), exports, "utf-8");
};
