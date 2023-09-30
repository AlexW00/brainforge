import { singleton } from "@launchtray/tsyringe-async";
import { EventBus } from "../../classes/abstract/EventBus";
import { UiEventDataMap } from "../../types/UiEventDataMap";

@singleton()
export class UiEventBus extends EventBus<UiEventDataMap> {}
