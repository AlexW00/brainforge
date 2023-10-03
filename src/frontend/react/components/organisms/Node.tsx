import React, { FunctionComponent, PropsWithChildren, useMemo, useRef } from "react";
import { NodeIdContext } from "../../contexts/NodeIdContext";
import { DragbarComponent } from "./Dragbar";
import { HandlesComponent } from "./Handles";
import { TemplateNode } from "../../../../core/data/models/flashcards/template/graph/TemplateNode";
import { useTemplateNodeService } from "../../hooks/context/useTemplateNodeService";
import { TemplateNodeParams } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";

export const NodeComponent: FunctionComponent<TemplateNode> = (
  props: PropsWithChildren<TemplateNode>,
  _context?: any
) => {
  const definitionId = props.data.definitionId;
  const templateNodeService = useTemplateNodeService()
  const definition = templateNodeService.getTemplateNode(definitionId);

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const contentRef = useRef(null);

  // re write contentProps here with the correct hook

  const contentProps: TemplateNodeParams = useMemo(() => ({
    id: props.id,
    data: props.data.data,
    doCache: props.data.doReRunOnRender,
    inputHandles: props.data.io.inputs,
    outputHandles: props.data.io.outputs,
  }), [props.data.data, props.data.doReRunOnRender, props.data.io.inputs, props.data.io.outputs]);

  React.useEffect(() => {
    if (!contentRef.current) return;
    const content = contentRef.current;
  
    if (!definition) {
      console.error("Definition not found!");
      return;
    }
    definition?.onLoad(content, contentProps);
  }, []);


  if (!definition) return <>Definition not found!</>;

  return (
    <NodeIdContext.Provider value={props.id}>
      <div
        className="custom-node react-flow__node-default"
        style={{ padding: 0, height: "auto", width: "auto", display: "flex"
      }}
      >
        <HandlesComponent
          isInput={true}
          handles={props.data.io.inputs}
        />
        <div style={{ display: "flex", flexDirection: "column"}}>
          <DragbarComponent
            name={definition?.metadata.name}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          {/* <div in={!isCollapsed} animateOpacity> */}
          <div>
            <div id={"content-" + props.id} ref={contentRef} style={{ margin: "0.5rem" }}>
            </div>
          </div>
        </div>
      </div>

      <HandlesComponent
        isInput={false}
        handles={props.data.io.outputs}
      />
    </NodeIdContext.Provider>
  );
};
