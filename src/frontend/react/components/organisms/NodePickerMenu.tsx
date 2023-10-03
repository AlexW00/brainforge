import React, { useState } from "react";
import { Position } from "reactflow";
import { useTemplateNodeService } from "../../hooks/useTemplateNodeService";
import { TemplateNodeDefinition } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";

export type PositionProps = {
    top: number;
    left: number;
}

export type NodePickerProps = PositionProps & {
    onClick: () => void;
}

function groupByCategory(nodes: TemplateNodeDefinition[]) {
    return nodes.reduce((groupedNodes: any, node) => {
        (groupedNodes[node.metadata.category] = groupedNodes[node.metadata.category] || []).push(node);
        return groupedNodes;
    }, {});
}

export default function NodePickerMenu({ top, left, ...props }: NodePickerProps) {
    console.log("Rendering context menu", top, left);

    const contextMenuStyle = {
        position: "absolute",
        zIndex: 10,
        top,
        left,
        display: 'flex',
        flexDirection: 'row',
    };

    const templateNodeService = useTemplateNodeService();
    const nodes = templateNodeService.getTemplateNodes();
    const groupedNodes = groupByCategory(nodes);

    const [expandedNodes, setExpandedNodes] = useState<TemplateNodeDefinition[]>([]);
    const [expandedCategory, setExpandedCategory] = useState("");

    const handleCategoryHover = (category: string) => {
        const nodes = groupedNodes[category];
        setExpandedNodes(nodes ?? []);
        setExpandedCategory(category);
    };

    return (
        <div style={contextMenuStyle} className="context-menu" {...props}
        onMouseLeave={() => handleCategoryHover("")}
        >   
        <div>

        <div className="drawer">
            <div className="categories">
            <div className="title">
            Nodes Picker
        </div>
                {
                Object.keys(groupedNodes).map((category, index) => (
                    <div
                        key={index}
                        className={`category ${expandedCategory === category ? "expanded" : ""}`}
                        onMouseEnter={() => handleCategoryHover(category)}
                    >
                        <div className="category-name item">{category}</div>

                    </div>
                ))
                }
            </div>
            <div className={`nodes ${expandedCategory === "" ? "hidden" : ""}`}>
                {
                expandedNodes.map((node, index) => (
                    <div key={index} className="node">
                        <div className="node-name item">{node.metadata.name}</div>
                    </div>
                ))
                }
            </div>
        </div>
        </div>

        </div>
    );
}