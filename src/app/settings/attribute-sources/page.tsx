"use client";

import { ListAttributeSource } from "@/components/list-attribute-source/list-attribute-source.component";
import { List } from "@/components/list/list.component";
import { SortableList } from "@/components/sortable-list/sortable-list.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { setAttributeSourceOrder, useGetAllAttributeSources } from "@api";
import { AttributeSource } from "@api/model";
import { useEffect, useState } from "react";

export default function Page() {
	const { data: attributesResponse } = useGetAllAttributeSources({
		query: {
			enabled: true,
			// refetchInterval: 3000,
		},
	});
	const [sources, setSources] = useState<AttributeSource[]>([]);
	const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

	useEffect(() => {
		if (attributesResponse?.status == 200) {
			setSources(attributesResponse.data);
		}
	}, [attributesResponse?.status, attributesResponse?.data]);

	if (!attributesResponse) {
		return <Spinner position="expand" />;
	}

	function updateOrder() {
		if (isUpdatingOrder) {
			return;
		}
		setIsUpdatingOrder(true);

		setAttributeSourceOrder({
			sources: sources.map((source) => ({
				pluginId: source.pluginId,
				sourceId: source.sourceId,
			})),
		})
			.then((response) => {
				setSources(response.data);
			})
			.finally(() => setIsUpdatingOrder(false));
	}

	return (
		<div>
			<SortableList
				items={sources}
				onOrder={setSources}
				onSortEnd={updateOrder}
				getItemKey={(s) => `${s.pluginId}-${s.sourceId}`}
				renderItem={(source) => <ListAttributeSource source={source} />}
			/>
		</div>
	);
}
