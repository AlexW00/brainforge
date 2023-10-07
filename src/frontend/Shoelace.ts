import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { registerIconLibrary } from "@shoelace-style/shoelace";

// import all components instead of individual components
import "@shoelace-style/shoelace/dist/shoelace.js";

export const initShoelace = () => {
	setBasePath("/shoelace");

	registerIconLibrary("ph-regular", {
		resolver: (name) => `/phosphor-icons/core/assets/regular/${name}.svg`,
	});
	registerIconLibrary("ph-bold", {
		resolver: (name) => `/phosphor-icons/core/assets/bold/${name}.svg`,
	});
	registerIconLibrary("ph-light", {
		resolver: (name) => `/phosphor-icons/core/assets/light/${name}.svg`,
	});
	registerIconLibrary("ph-thin", {
		resolver: (name) => `/phosphor-icons/core/assets/thin/${name}.svg`,
	});
	registerIconLibrary("ph-duotone", {
		resolver: (name) => `/phosphor-icons/core/assets/duotone/${name}.svg`,
	});
	registerIconLibrary("ph-fill", {
		resolver: (name) => `/phosphor-icons/core/assets/fill/${name}.svg`,
	});
};
