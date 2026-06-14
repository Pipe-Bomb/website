"use client";

import { useTranslation } from "@/context/language.context";
import { useRankedAttributes } from "@/hook/ranked-attributes.hook";
import { SmartFilterDto } from "@/interface/smart-filter.dto";
import { useMemo } from "react";

export function useAttributeFilterDescription(dto: SmartFilterDto | null) {
	const attributes = useRankedAttributes(dto?.entityType ?? "track");
	const { t } = useTranslation();

	return useMemo(() => {
		if (!dto) {
			return null;
		}

		let name = dto.attributeKey;

		const attribute = attributes?.find(
			(attribute) =>
				attribute.key == dto.attributeKey &&
				attribute.type == dto.attributeType,
		);

		if (attribute) {
			name = t(
				`plugin.${attribute.pluginId}.attribute.${dto.entityType}.${attribute.sourceId}.${attribute.key}.name`,
				attribute.key,
			);
		}

		switch (dto.attributeType) {
			case "string": {
				if (dto.inverse) {
					if (dto.value) {
						if (dto.partial) {
							return `${name} doesn't contain ${dto.value}`;
						} else {
							return `${name} Isn't ${dto.value}`;
						}
					} else {
						return `${name} doesn't exist`;
					}
				} else {
					if (dto.value) {
						if (dto.partial) {
							return `${name} contains ${dto.value}`;
						} else {
							return `${name} is ${dto.value}`;
						}
					} else {
						return `${name} exists`;
					}
				}
			}
			case "boolean": {
				if (dto.inverse) {
					if (typeof dto.value == "boolean") {
						if (dto.value) {
							return `${name} isn't true`;
						} else {
							return `${name} isn't false`;
						}
					} else {
						return `${name} doesn't exist`;
					}
				} else {
					if (typeof dto.value == "boolean") {
						if (dto.value) {
							return `${name} is true`;
						} else {
							return `${name} is false`;
						}
					} else {
						return `${name} exists`;
					}
				}
			}
			case "decimal":
			case "integer": {
				if (dto.inverse) {
					if (typeof dto.value == "number") {
						return `${name} isn't ${dto.value}`;
					} else {
						if (typeof dto.min == "number") {
							if (typeof dto.max == "number") {
								return `Not ${dto.min} <= ${name} <= ${dto.max}`;
							} else {
								return `Not ${dto.min} <= ${name}`;
							}
						} else {
							if (typeof dto.max == "number") {
								return `Not ${name} <= ${dto.max}`;
							} else {
								return `${name} doesn't exist`;
							}
						}
					}
				} else {
					if (typeof dto.value == "number") {
						return `${name} is ${dto.value}`;
					} else {
						if (typeof dto.min == "number") {
							if (typeof dto.max == "number") {
								return `${dto.min} <= ${name} <= ${dto.max}`;
							} else {
								return `${dto.min} <= ${name}`;
							}
						} else {
							if (typeof dto.max == "number") {
								return `${name} <= ${dto.max}`;
							} else {
								return `${name} exists`;
							}
						}
					}
				}
			}
			case "buffer": {
				if (dto.inverse) {
					return `${name} doesn't exist`;
				} else {
					return `${name} exists`;
				}
			}
			default:
				throw new Error("Not implemented");
		}
	}, [dto, attributes]);
}
