import { getAuthHeaders } from "@/lib/server.util";
import { getAllLibraries } from "@api";
import Link from "next/link";

export default async function Page() {
	const librariesResponse = await getAllLibraries({
		headers: (await getAuthHeaders()) ?? {},
	});

	const libraries = librariesResponse.data;

	return (
		<div>
			{libraries.map((library) => (
				<Link
					key={`${library.pluginId} ${library.id}`}
					href={`/library/${library.pluginId}/${library.id}`}
				>
					{library.name}
				</Link>
			))}
		</div>
	);
}
