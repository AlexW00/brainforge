import React, { useMemo } from "react";
import ReactFlow, { Connection, Controls, Background, ConnectionLineType } from "reactflow";
import { areCompatible } from "../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandleType";
import { selectNode } from "../../../../core/data/selectors/editor/selectNode";
import { useGetEdges } from "../../hooks/state/getters/useGetEdges";
import { useGetNodes } from "../../hooks/state/getters/useGetNodes";
import { NodeComponent } from "./Node";
import { useZustand } from "../../hooks/context/useZustand";


export const Editor = () => {
  const nodes = useGetNodes();
  const edges = useGetEdges();

  const zustand = useZustand()


  const { onNodesChange, onEdgesChange, onConnect } = zustand();

  const nodeTypes = useMemo(() => ({ custom: NodeComponent }), []);


  const handleConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) {
      console.error("Cannot connect nodes, missing source or target");
      return;
    }
    if (!connection.sourceHandle || !connection.targetHandle) {
        console.error("Cannot connect nodes, missing sourceHandle or targetHandle");
      return;}

    const sourceNode = selectNode(connection.source, nodes);
    const targetNode = selectNode(connection.target, nodes);

    if (!sourceNode || !targetNode) {
      console.error("Cannot connect nodes, missing source or target");
      return;}


    const sourceHandleType =
      sourceNode.data.io.outputs[connection.sourceHandle].type;
    const targetHandleType =
      targetNode.data.io.inputs[connection.targetHandle].type;
    if (
      sourceNode.id !== targetNode.id &&
      areCompatible(sourceHandleType, targetHandleType)
    ) {
      console.log("Connecting", sourceNode, targetNode);
      onConnect(connection);
    } else {
      console.log("Cannot connect", sourceHandleType, targetHandleType, "are not compatible");
    }
  };


  return (
      <ReactFlow
        connectionLineType={ConnectionLineType.Step}
        nodeTypes={nodeTypes as any}
        nodes={nodes}
        edges={edges}
        onNodesChange={(nodeChanges) => onNodesChange(nodeChanges)}
        onEdgesChange={(edgeChanges) => onEdgesChange(edgeChanges)}
        onConnect={handleConnect}
        fitView
        snapToGrid
        // onContextMenu={onContextMenu}
      >
        <Controls />
        <Background />
      </ReactFlow>

  );
};
