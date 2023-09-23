import "reflect-metadata"; // required for TypeDI

import "./frontend/components/components.ts";

// storage.pouch.user.getDoc().then((user) => {
// 	console.log(user);
// });
import { container } from "@launchtray/tsyringe-async";
import { StorageService } from "./core/services/storage/StorageService";

const instance = await container.resolve(StorageService);

// await instance.pouch.cardService.setDoc({
// 	id: "1",
// 	templateId: "1",
// 	reviewData: {
// 		reviews: [],
// 		dueOn: new Date(),
// 	},
// 	metadata: {
// 		creationTimestamp: Date(),
// 	},
// });
const card = await instance.pouch.cardService.get("1");

console.log(card);
