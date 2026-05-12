"use client";

import { ListLibrary } from "@/components/list-library/list-library.component";
import { List } from "@/components/list/list.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useGetAllLibraries } from "@api";

export default function Page() {
	const { data: librariesResponse } = useGetAllLibraries({
		query: {
			enabled: true,
			refetchInterval: 3000,
		},
	});

	if (!librariesResponse) {
		return <Spinner position="expand" />;
	}

	const libraries = librariesResponse.data;

	return (
		<div>
			<List>
				{libraries.map((library) => (
					<ListLibrary
						library={library}
						key={`${library.pluginId} ${library.id}`}
					/>
				))}
			</List>
		</div>
	);
}
