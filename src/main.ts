import "reflect-metadata"; // required for TypeDI
import { PouchDebugService } from "./core/services/storage/pouch/docs/PouchDebugService";
import { container } from "tsyringe";

import "@phosphor-icons/webcomponents";
import("./frontend/components/components");

const debugService = container.resolve(PouchDebugService);
// debugService.clearDb();
