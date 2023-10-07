import React, {
	FunctionComponent,
	PropsWithChildren,
	useMemo,
	useRef,
} from "react";
import { NodeIdContext } from "../../contexts/NodeIdContext";
import { HandlesComponent } from "./Handles";
import { TemplateNode } from "../../../../core/data/models/flashcards/template/graph/TemplateNode";
import { TemplateNodeParams } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import {
	SlCard,
	SlDropdown,
	SlIconButton,
	SlMenu,
	SlMenuItem,
} from "@shoelace-style/shoelace/dist/react/index";
import { useTemplateEditorService } from "../../hooks/context/useTemplateEditorService";
import { container } from "tsyringe";
import { ElementRegistrarService } from "../../../../core/services/app/ElementRegistrarService";

export const NodeComponent: FunctionComponent<TemplateNode> = (
	props: PropsWithChildren<TemplateNode>,
	_context?: any
) => {
	const definitionId = props.data.definitionId;
	const templateEditorService = useTemplateEditorService();
	const elementRegistrarService = container.resolve(ElementRegistrarService);

	const definition = elementRegistrarService.getTemplateNode(definitionId);

	const contentRef = useRef(null);

	const contentProps: TemplateNodeParams = useMemo(
		() => ({
			id: props.id,
			data: props.data.data,
			doCache: props.data.doReRunOnRender,
			inputHandles: props.data.io?.inputs,
			outputHandles: props.data.io?.outputs,
		}),
		[
			props.data.data,
			props.data.doReRunOnRender,
			props.data.io?.inputs,
			props.data.io?.outputs,
		]
	);

	React.useEffect(() => {
		if (!contentRef.current) return;
		const content = contentRef.current;

		if (!definition) {
			console.error("Definition not found!");
			return;
		}
		definition?.onLoad(content, contentProps);
	}, []);

	React.useEffect(() => {
		if (!contentRef.current) return;
		const content = contentRef.current;

		if (!definition) {
			console.error("Definition not found!");
			return;
		}
		definition?.onUpdate(contentProps);
	}, [contentProps]);

	if (!definition) return <>Definition not found!</>;

	const handleDoCacheSwitchChange = (isChecked: boolean) => {
		templateEditorService.setDoCache(props.id, isChecked);
	};

	const handleSettingsSelect = (event: any) => {
		const element = event.detail.item;
		const id = element.id;

		if (id === "cache-result") handleDoCacheSwitchChange(element.checked);
	};

	return (
		<NodeIdContext.Provider value={props.id}>
			<HandlesComponent isInput={true} handles={props.data.io?.inputs} />
			<SlCard
				className="custom-node card-header"
				style={{ padding: 0, height: "auto", width: "auto", display: "flex" }}
			>
				<div className="custom-node-header" slot="header">
					<div className="title">{definition?.metadata.name}</div>
					<SlDropdown className="settings">
						<SlIconButton
							library="ph-regular"
							name="gear-six"
							slot="trigger"
						></SlIconButton>
						<SlMenu onSlSelect={handleSettingsSelect}>
							<SlMenuItem
								id="cache-result"
								type="checkbox"
								checked={!props.data.doReRunOnRender}
							>
								Cache Result
							</SlMenuItem>
						</SlMenu>
					</SlDropdown>
				</div>
				<div
					id={"content-" + props.id}
					className="custom-node-content"
					ref={contentRef}
				></div>
			</SlCard>

			<HandlesComponent isInput={false} handles={props.data.io?.outputs} />
		</NodeIdContext.Provider>
	);
};
