import React from "react";
import { container } from "tsyringe";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";

const templateEditorService = container.resolve(TemplateEditorService);

export const TemplateEditorServiceContext =
	React.createContext<TemplateEditorService>(templateEditorService);
