import { inject, singleton } from "tsyringe";
import { SessionZustandService } from "../storage/zustand/SessionZustandService";
import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
	NodeOutputHandleValueFunction,
} from "../../data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";

@singleton()
export class EditorNodeService {
	constructor(
		@inject(SessionZustandService)
		private readonly sessionZustand: SessionZustandService
	) {}

	setOutputHandles = (
		nodeId: string,
		handles: NodeHandles<NodeOutputHandle>
	) => {
		this.sessionZustand.state.setNodeHandles(nodeId, false, handles);
	};

	setInputHandles = (nodeId: string, handles: NodeHandles<NodeInputHandle>) => {
		this.sessionZustand.state.setNodeHandles(nodeId, true, handles);
	};

	setData(nodeId: string, data: any) {
		this.sessionZustand.state.setNodeDataData(nodeId, data);
	}

	setDoCache(nodeId: string, doCache: boolean) {
		this.sessionZustand.state.setNodeCaching(nodeId, doCache);
	}

	setOutputhandleValue(
		nodeId: string,
		handleId: string,
		value: NodeOutputHandleValueFunction
	) {
		this.sessionZustand.state.setOutputData(nodeId, handleId, value);
	}
}
