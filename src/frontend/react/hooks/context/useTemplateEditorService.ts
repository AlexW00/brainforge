import { useContext } from "react";
import { TemplateEditorService } from "../../../../core/services/app/TemplateEditorService";
import { TemplateEditorServiceContext } from "../../contexts/TemplateEditorService";

export const useTemplateEditorService = (): TemplateEditorService => {
	return useContext(TemplateEditorServiceContext);
};
