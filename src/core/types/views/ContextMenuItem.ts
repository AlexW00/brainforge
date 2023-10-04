import { Position } from "../general/Position";

export interface ContextMenuItem {
	title: string;
	onClick: (position: Position) => void;
}

export interface ContextMenuGroup {
	title: string;
	items: ContextMenuItem[];
}

export type ContextMenuEntry = ContextMenuItem | ContextMenuGroup;

export interface ContextMenu {
	entries: ContextMenuEntry[];
}
