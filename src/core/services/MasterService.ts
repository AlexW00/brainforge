import { inject, singleton } from "tsyringe";
import { Initializeable } from "../types/general/Initializeable";
import { StorageService } from "./storage/StorageService";
import { AppRibbonService } from "./app/AppRibbonService";
import { CardRenderService } from "./app/CardRenderService";
import { ReviewService } from "./app/ReviewService";
import { LoggerService } from "./app/LoggerService";
import { stockAppRibbonItems } from "../static/ui/StockAppRibbonItems";

@singleton()
export class MasterService implements Initializeable {
	isInitialized: boolean = false;

	constructor(
		@inject(StorageService) public storage: StorageService,
		@inject(AppRibbonService) public appRibbonService: AppRibbonService,
		@inject(CardRenderService) public cardRenderService: CardRenderService,
		@inject(ReviewService) public reviewService: ReviewService,
		@inject(LoggerService) public loggerService: LoggerService
	) {}

	async init() {
		await this.storage.init();
		this.loadRibbonItems();
		this.isInitialized = true;
	}

	private loadRibbonItems() {
		const stockItems = stockAppRibbonItems;
		stockItems.forEach((item) => this.appRibbonService.addItem(item));

		// Todo: load custom items from storage
	}
}
