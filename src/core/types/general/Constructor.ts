import { Identifiable } from "./Identifiable";
import { Metadata } from "./Metadata";

export type Constructor<T> = new (...args: any[]) => T;

export type IdentifiableConstructor<T, M extends Metadata> = {
	constructor: Constructor<T>;
	metadata: M;
};
