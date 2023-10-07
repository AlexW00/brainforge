import "reflect-metadata"; // required for TypeDI
import { initShoelace } from "./frontend/Shoelace";

initShoelace();

import("./frontend/components/components");
