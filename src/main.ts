import "reflect-metadata"; // required for TypeDI
import { PouchDebugService } from "./core/services/storage/pouch/docs/PouchDebugService";
import { container } from "tsyringe";

// shoelace path
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
setBasePath("/shoelace");

// phosphor icons
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

import { registerIconLibrary } from "@shoelace-style/shoelace";
import("./frontend/components/components");

const _debugService = container.resolve(PouchDebugService);
// debugService.clearDb();
