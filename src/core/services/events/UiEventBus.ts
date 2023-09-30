import { singleton } from "tsyringe";
import { UiEventDataMap } from "../../types/events/UiEventDataMap";
import { Observable } from "../../types/events/Observable";

@singleton()
export class UiEventBus extends Observable<UiEventDataMap> {}
