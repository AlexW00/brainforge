import React from "react";
import { NodeHandles } from "../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { useNodeId } from "../../hooks/context/useNodeId";

export const HandlesComponent = React.memo(
	({
		isInput,
		handles,
	}: {
		isInput: boolean;
		handles?: NodeHandles<any>;
	}): JSX.Element => {
		const calculateHandleTopOffset = (
			index: number,
			numHandles: number
		): string => {
			const offset = 100 / (numHandles + 1);
			return `${offset * (index + 1)}%`;
		};
		const updateInternals = useUpdateNodeInternals();
		const nodeId = useNodeId();
		updateInternals(nodeId);

		const mapHandles = (
			io: NodeHandles<any>,
			isInput: boolean
		): JSX.Element[] => {
			const keys = Object.keys(io);

			return keys.map((key, index) => {
				const handleTopOffset = calculateHandleTopOffset(index, keys.length),
					handle = io[key],
					type = handle.type;
				return (
					// todo: add tooltip
					<Handle
						key={key}
						id={key}
						type={isInput ? "target" : "source"}
						position={isInput ? Position.Left : Position.Right}
						style={{
							top: handleTopOffset,
							background: type.color,
						}}
					/>
				);
			});
		};

		return (
			<div className="handles">{handles && mapHandles(handles, isInput)}</div>
		);
	}
);
