import { getLibrary } from "@api";
import { LibraryTracks } from "@c/library-tracks/library-tracks.component";
import styles from "./page.module.scss";
import { Metadata } from "next";
import { RootPadding } from "@/components/root-padding/root-padding.component";
import { getAuthHeaders } from "@/lib/server.util";

interface Props {
	params: Promise<{
		pluginId: string;
		libraryId: string;
	}>;
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata | null> {
	const { pluginId, libraryId } = await params;

	const { data } = await getLibrary(pluginId, libraryId, {
		headers: (await getAuthHeaders()) ?? {},
	});

	if (!data) {
		return null;
	}

	return {
		title: `${data.name} - Pipe Bomb`,
	};
}

export default async function Page({ params }: Props) {
	const { pluginId, libraryId } = await params;

	const libraryResponse = await getLibrary(pluginId, libraryId, {
		headers: (await getAuthHeaders()) ?? {},
	});
	if (libraryResponse.status == 404) {
		return <h1>Not found</h1>;
	}
	const library = libraryResponse.data;

	return (
		<RootPadding vertical>
			<h1 className={styles.libraryName}>{library.name}</h1>
			<LibraryTracks library={library} />
		</RootPadding>
	);
}
