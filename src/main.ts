import "reflect-metadata"; // required for TypeDI

import "./frontend/components/components.ts";

// storage.pouch.user.getDoc().then((user) => {
// 	console.log(user);
// });
import { container } from "@launchtray/tsyringe-async";
import { StorageService } from "./core/services/private/StorageService.ts";

const instance = await container.resolve(StorageService);

instance.pouch.userService.getDoc().then((preferences) => {
	console.log(preferences);
});
