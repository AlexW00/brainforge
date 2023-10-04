export interface ContextMenuItem {
	title: string;
	onClick: () => void;
}

export interface ContextMenuGroup {
	tile: string;
	items: ContextMenuItem[];
}

export type ContextMenuEntry = ContextMenuItem | ContextMenuGroup;

export interface ContextMenu {
	entries: ContextMenuEntry[];
}
