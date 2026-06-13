import {
	AttributeEntity,
	LoadedAttribute,
	useGetAllAttributes,
	useGetAllAttributeSources,
} from "@/api";
import { useMemo } from "react";

export function useRankedAttributes(entityType: AttributeEntity) {
	const allAttributesQuery = useGetAllAttributes({
		query: {
			enabled: true,
		},
	});

	const sourcesQuery = useGetAllAttributeSources({
		query: {
			enabled: true,
		},
	});

	return useMemo(() => {
		if (!allAttributesQuery.data || !sourcesQuery.data) {
			return null;
		}

		const allAttributes = allAttributesQuery.data.data[entityType];
		const sources = sourcesQuery.data.data;
		const sourcePriorities = sources.map(
			(source) => `${source.pluginId}:${source.sourceId}`,
		);

		const attributeMap = new Map<
			string,
			{ attribute: LoadedAttribute; priority: number }
		>();
		for (const attribute of allAttributes) {
			const priority = sourcePriorities.indexOf(
				`${attribute.pluginId}:${attribute.sourceId}`,
			);
			const key = `${attribute.key}:${attribute.type}`;
			const existingAttribute = attributeMap.get(key);
			if (existingAttribute && existingAttribute.priority < priority) {
				continue;
			}
			attributeMap.set(key, { attribute, priority });
		}

		return Array.from(attributeMap.values()).map(({ attribute }) => attribute);
	}, [allAttributesQuery.data, sourcesQuery.data, entityType]);
}
