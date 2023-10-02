import React, { useMemo } from "react";
import ReactFlow, { Connection, MiniMap, Controls, Background } from "reactflow";
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
    if (!connection.source || !connection.target) return;
    if (!connection.sourceHandle || !connection.targetHandle) return;

    const sourceNode = selectNode(connection.source, nodes);
    const targetNode = selectNode(connection.target, nodes);

    if (!sourceNode || !targetNode) return;


    const sourceHandleType =
      sourceNode.data.io.outputs[connection.sourceHandle].type;
    const targetHandleType =
      targetNode.data.io.inputs[connection.targetHandle].type;
    if (
      sourceNode.id !== targetNode.id &&
      areCompatible(sourceHandleType, targetHandleType)
    ) {
      onConnect(connection);
    } else {
      console.log("Cannot connect", sourceHandleType, targetHandleType);
    }
  };

  console.log("Rendering Editor");

  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

  console.log("Rendering Editor", nodes, edges);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodeTypes={nodeTypes as any}
        nodes={nodes ?? initialNodes}
        edges={edges ?? initialEdges}
        onNodesChange={(nodeChanges) => onNodesChange(nodeChanges)}
        onEdgesChange={(edgeChanges) => onEdgesChange(edgeChanges)}
        onConnect={handleConnect}
        fitView
        snapToGrid
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>

  );
};
