"use client";

import { Spinner } from "@/components/spinner/spinner.component";
import { useSearchArtists } from "@api";
import { useEffect } from "react";
import styles from "./artist-grid.module.scss";
import { GridArtist } from "@/components/grid-artist/grid-artist.component";
import { Paginator } from "@/components/paginator/paginator.component";
import { useUrlPagination } from "@/hook/url-pagination.hook";
import { Grid } from "@/components/grid/grid.component";

export function ArtistGrid() {
	const search = useSearchArtists();
	const { currentPage } = useUrlPagination();

	useEffect(() => {
		search.mutate({
			data: {
				page: currentPage,
				pageSize: 30,
			},
		});
	}, [currentPage]);

	if (!search.data) {
		return (
			<div className={styles.loading}>
				<Spinner position="expand" />
			</div>
		);
	}

	const artists = search.data.data.artists;

	return (
		<div className={styles.container}>
			<Grid>
				{artists.map((artist) => (
					<GridArtist key={artist.uuid} artist={artist} />
				))}
			</Grid>
			<Paginator urlKey="page" />
		</div>
	);
}
