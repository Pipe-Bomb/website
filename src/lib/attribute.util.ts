import {
	BooleanAttribute,
	DecimalAttribute,
	IntegerAttribute,
	StringAttribute,
	AttributeMap,
	BufferAttribute,
} from "@api/model";

export type AttributeUnion =
	| BooleanAttribute
	| IntegerAttribute
	| DecimalAttribute
	| StringAttribute
	| BufferAttribute;

type AttributeByType<T extends AttributeUnion["type"]> = Extract<
	AttributeUnion,
	{ type: T }
>;

export type SinglePersistentAttribute<T extends AttributeUnion["type"]> = {
	type: T;
	value: AttributeByType<T>["values"][number];
};

export type AttributeValueByType<T extends AttributeUnion["type"]> =
	AttributeByType<T>["values"][number];

export function getAttribute<T extends AttributeUnion["type"]>(
	attributes: AttributeMap | null,
	key: string,
	type: T,
	multiple?: false,
): AttributeValueByType<T> | null;

export function getAttribute<T extends AttributeUnion["type"]>(
	attributes: AttributeMap | null,
	key: string,
	type: T,
	multiple: true,
): AttributeValueByType<T>[] | null;

export function getAttribute(
	attributes: AttributeMap | null,
	key: string,
	type?: null,
	multiple?: boolean,
): AttributeUnion | null;

export function getAttribute<T extends AttributeUnion["type"]>(
	attributes: AttributeMap | null,
	key: string,
	type?: T | null,
	multiple?: boolean,
): any {
	if (!attributes) {
		return null;
	}

	const attribute = attributes[key] as AttributeUnion | undefined;
	if (key == "title") {
	}
	if (!attribute || !attribute.values.length) {
		return null;
	}

	if (type) {
		if (attribute.type !== type) {
			return null;
		}
		if (multiple) {
			return attribute.values;
		}
		return attribute.values[0];
	}

	return attribute;
}
