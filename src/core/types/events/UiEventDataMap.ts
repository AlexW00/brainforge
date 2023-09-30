import { DeckItemClicked } from "../../static/events/ui/DeckItemClicked";
import { RibbonItemClicked } from "../../static/events/ui/RibbonItemClicked";

export type UiEventDataMap = {
	"ribbon-item-clicked": RibbonItemClicked;
	"deck-item-clicked": DeckItemClicked;
};
