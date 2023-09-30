import { ExtensionCategory } from "./ExtensionCategory";
import { Metadata } from "../../../types/general/Metadata";

/**
 * Metadata for an extension.
 */
export interface ExtensionMetadata<T = ExtensionCategory> extends Metadata {
	category: T;
	author: string;

	version: string;
	minAppVersion?: string;
	maxAppVersion?: string;
}
