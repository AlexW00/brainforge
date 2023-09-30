import { exec } from "child_process";
import path from "path";

/**
 * Vite plugin to run a script at build start
 * @param scriptRelativePath Relative path to the script to run
 * @returns Vite plugin
 */
function runScript(scriptRelativePath: string) {
	return {
		name: "run-script",
		buildStart() {
			const scriptPath = path.resolve(process.cwd(), scriptRelativePath);
			exec(`node ${scriptPath}`, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				if (stderr) {
					console.error(`stderr: ${stderr}`);
				}
			});
		},
	};
}

export default runScript;
