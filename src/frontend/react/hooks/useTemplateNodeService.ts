import { container } from "tsyringe";
import { TemplateNodeService } from "../../../core/services/app/TemplateNodeService";

const templateNodeService = container.resolve(TemplateNodeService);

export const useTemplateNodeService = () => templateNodeService;
