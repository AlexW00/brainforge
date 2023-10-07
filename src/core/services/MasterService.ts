import { inject, singleton } from "tsyringe";
import { Initializeable } from "../types/general/Initializeable";
import { StorageService } from "./storage/StorageService";
import { AppRibbonService } from "./app/AppRibbonService";
import { CardRenderService } from "./app/CardRenderService";
import { ReviewService } from "./app/ReviewService";
import { LoggerService } from "./app/LoggerService";
import { stockAppRibbonItems } from "../static/ui/StockAppRibbonItems";
import { ElementRegistrarService } from "./app/ElementRegistrarService";
import { STOCK_PAGES } from "../../frontend/components/pages/StockPages";
import { STOCK_MODALS } from "../../frontend/components/modals/StockModals";
import { UiEventHandler } from "./app/UiEventHandler";
import { TemplateNodeService } from "./app/TemplateNodeService";
import { STOCK_NODES } from "../../frontend/components/nodes/StockNodes";
import { STOCK_CARD_INPUT_FIELDS } from "../static/cardInputs/StockCardInputFields";

@singleton()
export class MasterService implements Initializeable {
	isInitialized: boolean = false;

	constructor(
		@inject(StorageService) public storage: StorageService,
		@inject(AppRibbonService) public appRibbonService: AppRibbonService,
		@inject(CardRenderService) public cardRenderService: CardRenderService,
		@inject(ReviewService) public reviewService: ReviewService,
		@inject(LoggerService) public loggerService: LoggerService,
		@inject(ElementRegistrarService)
		public elementRegistrarService: ElementRegistrarService,
		@inject(UiEventHandler) public _uiEventHandler: UiEventHandler,
		@inject(TemplateNodeService)
		private templateNodeService: TemplateNodeService
	) {}

	async init() {
		await this.storage.init();
		this.loadRibbonItems();
		this.loadPages();
		this.loadModals();
		this.loadTemplateNodes();
		this.loadCardInputFields();
		this.isInitialized = true;
	}

	private loadRibbonItems() {
		const stockItems = stockAppRibbonItems;
		stockItems.forEach((item) => this.appRibbonService.addItem(item));
	}

	private loadPages() {
		STOCK_PAGES.forEach((page) =>
			this.elementRegistrarService.registerPageDefinition(page)
		);
	}

	private loadModals() {
		STOCK_MODALS.forEach((modal) =>
			this.elementRegistrarService.registerModalDefinition(modal)
		);
	}

	private loadTemplateNodes() {
		STOCK_NODES.forEach((node) =>
			this.templateNodeService.registerTemplateNode(node)
		);
	}

	private loadCardInputFields() {
		STOCK_CARD_INPUT_FIELDS.forEach((field) =>
			this.elementRegistrarService.registerCardInputFieldDefinition(field)
		);
	}
}
