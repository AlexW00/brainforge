import React from "react";
import { TemplateNodeService } from "../../../core/services/app/TemplateNodeService";
import { container } from "tsyringe";

const templateNodeService = container.resolve(TemplateNodeService);

export const TemplateNodeServiceContext =
	React.createContext<TemplateNodeService>(templateNodeService);
