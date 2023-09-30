import { DeckItemClicked } from "../../static/events/ui/DeckItemClicked";
import { PageActionClicked } from "../../static/events/ui/PageActionClicked";
import { RibbonItemClicked } from "../../static/events/ui/RibbonItemClicked";

export type UiEventDataMap = {
	"ribbon-item-clicked": RibbonItemClicked;
	"deck-item-clicked": DeckItemClicked;
	"page-action-clicked": PageActionClicked;
};
