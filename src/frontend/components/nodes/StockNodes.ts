import {TemplateNodeDefinition} from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import {TemplateNodeMetadata} from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import {IdentifiableConstructor} from "../../../core/types/general/Constructor";
import {InputNodeDefinitionBundle} from "./InputNode";
import {OutputNodeDefinitionBundle} from "./OutputNode";
import {TestNodeDefinitionBundle} from "./TestNode";
import {OpenAiNodeDefinitionBundle} from "./openai/DefinitionBundle";
import {TemplatingNodeDefinitionBundle} from "./TemplateNode";

export const STOCK_NODES: IdentifiableConstructor<
    TemplateNodeDefinition,
    TemplateNodeMetadata
>[] = [
    TestNodeDefinitionBundle,
    OutputNodeDefinitionBundle,
    InputNodeDefinitionBundle,
    OpenAiNodeDefinitionBundle,
    TemplatingNodeDefinitionBundle
];
