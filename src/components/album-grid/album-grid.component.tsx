"use client";

import { Spinner } from "@/components/spinner/spinner.component";
import { useSearchAlbums } from "@api";
import { useState, useEffect } from "react";
import styles from "./album-grid.module.scss";
import { Paginator } from "@/components/paginator/paginator.component";
import { useUrlPagination } from "@/hook/url-pagination.hook";
import { GridAlbum } from "@/components/grid-album/grid-album.component";
import { Grid } from "@/components/grid/grid.component";

export function AlbumGrid() {
	const search = useSearchAlbums();
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

	const albums = search.data.data.albums;

	return (
		<div className={styles.container}>
			<Grid>
				{albums.map((album) => (
					<GridAlbum key={album.uuid} album={album} />
				))}
			</Grid>
			<Paginator urlKey="page" />
		</div>
	);
}
