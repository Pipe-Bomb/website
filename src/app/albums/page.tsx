import { AlbumGrid } from "@/components/album-grid/album-grid.component";
import { List } from "@/components/list/list.component";
import { searchAlbums } from "@api";
import Link from "next/link";

export default async function Page() {
	const albumsResponse = await searchAlbums({
		page: 1,
		pageSize: 30,
	});

	const albums = albumsResponse.data.albums;

	return (
		<div>
			<h1>Albums</h1>
			<AlbumGrid />
		</div>
	);
}
