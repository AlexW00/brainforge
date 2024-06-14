import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, {
	Background,
	Connection,
	ConnectionLineType,
	Controls,
	Viewport,
	getRectOfNodes,
	getTransformForBounds,
	useOnViewportChange,
} from "reactflow";
import { areCompatible } from "../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandleType";
import { useZustand } from "../../hooks/context/useZustand";
import { useGetEdges } from "../../hooks/state/getters/useGetEdges";
import { useGetNodes } from "../../hooks/state/getters/useGetNodes";
import { useGetViewport } from "../../hooks/state/getters/useGetViewport";
import { NodeComponent } from "./Node";
import { toPng } from "html-to-image";
import { TemplateEditorService } from "../../../../core/services/app/TemplateEditorService";
import { container } from "tsyringe";
import { UiEventBus } from "../../../../core/services/events/UiEventBus";

export const Editor = () => {
	const nodes = useGetNodes();
	const edges = useGetEdges();
	const viewport = useGetViewport();
	const templateService = container.resolve(TemplateEditorService);
	const uiEventBus = container.resolve(UiEventBus);

	useEffect(() => {
		uiEventBus.on("save-template", onSave);
		return () => {
			uiEventBus.off("save-template", onSave);
		};
	}, []);

	const zustand = useZustand();

	const ref = useRef<any>(null);

	const { onNodesChange, onEdgesChange, onConnect, onViewportChange } =
		zustand();

	const nodeTypes = useMemo(() => ({ custom: NodeComponent }), []);

	const selectNode = (id: string, nodes: any[]) => {
		return nodes.find((node) => node.id === id);
	};

	const handleConnect = (connection: Connection) => {
		if (!connection.source || !connection.target) {
			console.error("Cannot connect nodes, missing source or target");
			return;
		}
		if (!connection.sourceHandle || !connection.targetHandle) {
			console.error(
				"Cannot connect nodes, missing sourceHandle or targetHandle"
			);
			return;
		}

		const sourceNode = selectNode(connection.source, nodes);
		const targetNode = selectNode(connection.target, nodes);

		if (!sourceNode || !targetNode) {
			console.error("Cannot connect nodes, missing source or target");
			return;
		}

		const sourceHandleType =
			sourceNode.data.io?.outputs[connection.sourceHandle].type;
		const targetHandleType =
			targetNode.data.io?.inputs[connection.targetHandle].type;

		if (!sourceHandleType || !targetHandleType) {
			console.error(
				"Cannot connect nodes, missing sourceHandleType or targetHandleType"
			);
			return;
		}

		if (
			sourceNode.id !== targetNode.id &&
			areCompatible(sourceHandleType, targetHandleType)
		) {
			console.log("Connecting", sourceNode, targetNode);
			onConnect(connection);
		} else {
			console.log(
				"Cannot connect",
				sourceHandleType,
				targetHandleType,
				"are not compatible"
			);
		}
	};

	const onSave = async () => {
		const imageWidth = 400;
		const imageHeight = 300;
		const nodesBounds = getRectOfNodes(
			templateService.getTemplate()?.graph.nodes!!
		);
		const transform = getTransformForBounds(
			nodesBounds,
			imageWidth,
			imageHeight,
			0.5,
			2
		);
		const reactFlowEl = ref.current;
		const viewport = reactFlowEl.querySelector(".react-flow__viewport");

		const png = await toPng(
			viewport,
			{
				backgroundColor: "white",
				width: imageWidth,
				height: imageHeight,
				skipFonts: true,
				style: {
					width: imageWidth.toString(),
					height: imageHeight.toString(),
					transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
				},
			}
		);
		templateService.setThumbnail(png);
		await templateService.saveTemplate();
	}


	return (
		<ReactFlow
			ref={ref}
			connectionLineType={ConnectionLineType.Step}
			nodeTypes={nodeTypes as any}
			nodes={nodes}
			edges={edges}
			onNodesChange={(nodeChanges) => onNodesChange(nodeChanges)}
			onEdgesChange={(edgeChanges) => onEdgesChange(edgeChanges)}
			onConnect={handleConnect}
			defaultViewport={viewport}
			snapToGrid
		>
			<Controls />
			<Background />
			<ViewportListener onViewportChange={onViewportChange} />
		</ReactFlow>
	);
};

// child component
const ViewportListener = ({
	onViewportChange,
}: {
	onViewportChange: (viewport: Viewport) => void;
}) => {
	useOnViewportChange({
		onChange: useCallback(onViewportChange, []),
	});

	return <></>;
};
