"use client";

import { ListAttributeSource } from "@/components/list-attribute-source/list-attribute-source.component";
import { ListIdentifier } from "@/components/list-identifier/list-identifier.component";
import { List } from "@/components/list/list.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useGetAllAttributeSources, useGetAllIdentifiers } from "@api";

export default function Page() {
	const { data: identifiersResponse } = useGetAllIdentifiers({
		query: {
			enabled: true,
			refetchInterval: 3000,
		},
	});

	if (!identifiersResponse) {
		return <Spinner position="expand" />;
	}

	const identifiers = identifiersResponse.data;

	return (
		<div>
			<List>
				{identifiers.map((identifier) => (
					<ListIdentifier
						key={`${identifier.pluginId} ${identifier.identifierId}`}
						identifier={identifier}
					/>
				))}
			</List>
		</div>
	);
}
