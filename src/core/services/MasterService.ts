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
		public elementRegistrarService: ElementRegistrarService
	) {}

	async init() {
		await this.storage.init();
		this.loadRibbonItems();
		this.loadPages();
		this.loadModals();
		this.isInitialized = true;
	}

	private loadRibbonItems() {
		const stockItems = stockAppRibbonItems;
		stockItems.forEach((item) => this.appRibbonService.addItem(item));

		// Todo: load custom items from storage
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
}
