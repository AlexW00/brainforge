import "reflect-metadata"; // required for TypeDI
import { initShoelace } from "./frontend/Shoelace";
import { PrimaryColor, setPrimaryColor } from "./core/types/views/PrimaryColor";

initShoelace();

import("./frontend/components/components");

setPrimaryColor(PrimaryColor.pink);
