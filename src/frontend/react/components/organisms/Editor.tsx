import React, { useMemo, useRef } from "react";
import ReactFlow, { Connection, Controls, Background, ConnectionLineType } from "reactflow";
import { areCompatible } from "../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandleType";
import { useGetEdges } from "../../hooks/state/getters/useGetEdges";
import { useGetNodes } from "../../hooks/state/getters/useGetNodes";
import { NodeComponent } from "./Node";
import { useZustand } from "../../hooks/context/useZustand";


export const Editor = () => {
  const nodes = useGetNodes();
  const edges = useGetEdges();

  const zustand = useZustand()

  const ref = useRef<any>(null);

  const { onNodesChange, onEdgesChange, onConnect } = zustand();

  const nodeTypes = useMemo(() => ({ custom: NodeComponent }), []);

  const selectNode = (id: string, nodes: any[]) => {
    return nodes.find((node) => node.id === id);
  }
  


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
      sourceNode.data.io?.outputs[connection.sourceHandle].type;
    const targetHandleType =
      targetNode.data.io?.inputs[connection.targetHandle].type;

    if (!sourceHandleType || !targetHandleType) {
      console.error("Cannot connect nodes, missing sourceHandleType or targetHandleType");
      return;}

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
      ref={ref}
      connectionLineType={ConnectionLineType.Step}
      nodeTypes={nodeTypes as any}
      nodes={nodes}
      edges={edges}
      onNodesChange={(nodeChanges) => onNodesChange(nodeChanges)}
      onEdgesChange={(edgeChanges) => onEdgesChange(edgeChanges)}
      onConnect={handleConnect}
      onClick={(event) => 
        {
          // necessary to create a new event here since
          // the old one does not propagate for some reason
          const newEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: event.clientX - ref.current.getBoundingClientRect().left,
            clientY: event.clientY - ref.current.getBoundingClientRect().top,   
          });
          document.dispatchEvent(newEvent);
        }
                  
      }
      fitView
      snapToGrid
      // onContextMenu={onContextMenu}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};
