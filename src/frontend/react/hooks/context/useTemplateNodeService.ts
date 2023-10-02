import { useContext } from "react";
import { TemplateNodeService } from "../../../../core/services/app/TemplateNodeService";
import { TemplateNodeServiceContext } from "../../contexts/TemplateNodeServiceContext";

export const useTemplateNodeService = (): TemplateNodeService => {
	return useContext(TemplateNodeServiceContext);
};
