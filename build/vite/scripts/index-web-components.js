import { glob } from "glob";
import fs from "fs";

/**
 * This script generates an index file for all your LIT web components (typescript)
 * The index file can be imported in your frontend code to import all web components.
 * Furthermore, it provides a custom element interface for typescript.
 * Component names are extracted from the @customElement decorator.
 */

import { WEB_COMPONENTS_DIR, OUT_FILE, FILES_TO_IGNORE } from "../consts.js";

const TAB = "    ";

/**
 * Returns an array of tuples containing the filename and file contents of all web components
 * @returns {Promise<[string, string]>} Array of tuples containing the filename and file contents
 */
const getComponentFiles = async () => {
	const componentFiles = await glob(`${WEB_COMPONENTS_DIR}/**/*.ts`, {
		ignore: FILES_TO_IGNORE,
	});
	// for each file: check if it has a customElement decorator
	const result = componentFiles
		.map((componentFile) => {
			const fileContents = fs.readFileSync(componentFile, "utf8");
			if (fileContents.includes("@customElement"))
				return [componentFile, fileContents];
			return undefined;
		})
		.filter((entry) => entry !== undefined);
	return result;
};

/**
 * Generates import statements for all web components
 * @param {string[]} filenames Array of web component filenames
 * @returns {string} String containing all import statements
 */
const generateImportStatements = (filenames) => {
	const importStatements = filenames.map((filename, i) => {
		// remove the WEB_COMPONENTS_DIR from the filename
		const rawPath = filename.replace(WEB_COMPONENTS_DIR, "");
		// remove the .ts extension
		const componentName = rawPath.split(".")[0];

		return `import _${i} from ".${componentName}";`;
	});
	return importStatements.join("\n");
};

/**
 * Generates export statements for all web components
 * @param {string[]} filenames Array of web component filenames
 * @returns {string} String containing all export statements
 */
const generateExportStatements = (filenames) => {
	const exportStatementContents = filenames.map((_, i) => `_${i}`);
	return `export { ${exportStatementContents.join(", ")} };`;
};

const generateCustomElementInterface = (componentFiles) => {
	const interfaceEntries = componentFiles.map(([filename, content], i) => {
		const customElementDecorator = content.match(
				/@customElement\(['"](.*)['"]\)/
			)[1],
			componentHtmlTag = customElementDecorator.match(/([a-z-]*)/)[1],
			componentName = "_" + i;
		return `'${componentHtmlTag}': ${componentName};`;
	});
	return `declare global {
${TAB}interface HTMLElementTagNameMap {
${TAB}${TAB}${interfaceEntries.join("\n" + TAB + TAB)}
${TAB}}
}`;
};

console.log(
	"[COMPONENT-INDEXER] Generating web components index file (" +
		OUT_FILE +
		")..."
);
const componentFiles = await getComponentFiles(),
	componentFileNames = componentFiles.map((entry) => entry[0]);

console.log(
	"[COMPONENT-INDEXER] Component files:",
	componentFileNames.join(", ")
);

// console.log("[COMPONENT-INDEXER] Generating import statements...");
const importStatements = generateImportStatements(componentFileNames);
// console.log("[COMPONENT-INDEXER] Generating export statements...");
const exportStatements = generateExportStatements(componentFileNames);
// console.log("[COMPONENT-INDEXER] Generating custom element interface...");
const customElementInterface = generateCustomElementInterface(componentFiles);

const fileContents = `//AUTO GENERATED BY index-web-components.js\n\n${importStatements}\n\n${exportStatements}\n\n${customElementInterface}`;

// console.log("[COMPONENT-INDEXER] Writing to file...");
fs.writeFileSync(OUT_FILE, fileContents);
console.log(
	"Generated web components index file, imported " +
		componentFiles.length +
		" web components."
);