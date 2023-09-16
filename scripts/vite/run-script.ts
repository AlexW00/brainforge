import { exec } from "child_process";
import path from "path";

function runScript() {
	return {
		name: "run-script",
		buildStart() {
			const scriptPath = path.resolve(
				process.cwd(),
				"scripts/vite/index-web-components.js"
			);
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
