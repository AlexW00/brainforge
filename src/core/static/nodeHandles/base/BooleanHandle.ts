import NodeHandleType from "../../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandleType";
import { AnyHandle } from "./AnyHandle";

export const BooleanHandle: NodeHandleType = {
	name: "boolean",
	color: "#00ff00",
	allowedInputs: [AnyHandle],
};
