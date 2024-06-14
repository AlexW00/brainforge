export enum PrimaryColor {
	gray = "gray",
	red = "red",
	orange = "orange",
	amber = "amber",
	yellow = "yellow",
	lime = "lime",
	green = "green",
	emerald = "emerald",
	teal = "teal",
	cyan = "cyan",
	sky = "sky",
	blue = "blue",
	indigo = "indigo",
	violet = "violet",
	purple = "purple",
	fuchsia = "fuchsia",
	pink = "pink",
	rose = "rose",
}
export const setPrimaryColor = (color: PrimaryColor) => {
	console.log("Setting primary color to", color);
	const root = document.documentElement;

	const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
	for (const shade of shades) {
		const variableName = `--sl-color-primary-${shade}`;
		const referenceVariableName = `--sl-color-${color}-${shade}`;
		root.style.setProperty(variableName, `var(${referenceVariableName})`);
	}
};
