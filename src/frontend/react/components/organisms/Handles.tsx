import React from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { NodeHandles } from "../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
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
			return isInput ? `${0.75 + 0.5 * 1.5 + index * 1.56}rem` : "50%";
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
							marginTop: isInput ? "2.75rem" : "",
							top: calculateHandleTopOffset(index, keys.length),
							background: type.color,
						}}
					/>
				);
			});
		};

		return (
			<div
				className="handles"
				style={{
					display: "flex",
				}}
			>
				{handles && mapHandles(handles, isInput)}
			</div>
		);
	}
);
