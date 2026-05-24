"use client";

import {
	Album,
	EphemeralTrack,
	useGetArtistEphemeralContent,
	useGetArtistEphemeralContentByIdentity,
	useGetArtistEphemeralSources,
} from "@api";
import styles from "./ephemeral-content-tabs.module.scss";
import { useEffect, useMemo } from "react";
import { Spinner } from "@/components/spinner/spinner.component";
import { Tabs } from "@/components/tabs/tabs.component";
import { Button } from "@/components/button/button.component";
import { useUrlParam } from "@/hook/url-param.hook";
import { HorizontalScroller } from "@/components/horizontal-scroller/horizontal-scroller.component";
import { GridAlbum } from "@/components/grid-album/grid-album.component";
import { TrackList } from "@/components/track-list/track-list.component";

interface Props {
	artistId: string;
}

export function ArtistEphemeralContentTabs({ artistId }: Props) {
	if (artistId.includes("~")) {
		const parts = artistId.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return (
				<ViaIdentity
					pluginId={pluginId}
					identifierId={identityId}
					identity={identity}
				/>
			);
		}
	} else {
		return <ViaUuid uuid={artistId} />;
	}

	return null;
}

interface ViaIdentityProps {
	pluginId: string;
	identifierId: string;
	identity: string;
}

function ViaIdentity({ pluginId, identifierId, identity }: ViaIdentityProps) {
	const sources = useGetArtistEphemeralContentByIdentity();

	useEffect(() => {
		sources.mutate({
			pluginId,
			identifierId,
			identity,
		});
	}, [pluginId, identifierId, identity]);

	const data = sources.data;

	if (!data) {
		return (
			<div className={styles.loading}>
				<Spinner position="expand" />
			</div>
		);
	}

	if (data.status == 400) {
		return null;
	}

	const { source, tracks, albums } = data.data;

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>From Other Sources</h2>
			<Tabs className={styles.tabs}>
				<Button style="primary">{source.name}</Button>
			</Tabs>
			<div className={styles.results}>
				<Content tracks={tracks} albums={albums} />
			</div>
		</div>
	);
}

interface ViaUuid {
	uuid: string;
}

function ViaUuid({ uuid }: ViaUuid) {
	const sourcesQuery = useGetArtistEphemeralSources(uuid);
	const sources = useMemo(() => {
		console.log(sourcesQuery.data);
		if (sourcesQuery.data && sourcesQuery.data.status == 200) {
			return sourcesQuery.data.data;
		}
		return null;
	}, [sourcesQuery.data]);
	const contentQuery = useGetArtistEphemeralContent();

	const [sourceId, setSourceId] = useUrlParam("source", {
		replace: true,
	});
	const activeSource = useMemo(() => {
		if (!sources?.length) {
			return null;
		}
		if (sourceId) {
			const match = sources.find(
				(source) => `${source.pluginId}~${source.id}` == sourceId,
			);
			if (match) {
				return match;
			}
		}
		return sources[0];
	}, [sources, sourceId]);

	useEffect(() => {
		if (activeSource) {
			contentQuery.mutate({
				artistUuid: uuid,
				data: {
					pluginId: activeSource.pluginId,
					sourceId: activeSource.id,
				},
			});
		} else {
			contentQuery.reset();
		}
	}, [activeSource, uuid]);

	if (sourcesQuery.isPending || contentQuery.isPending) {
		return (
			<div className={styles.loading}>
				<Spinner position="expand" />
			</div>
		);
	}

	const content =
		(contentQuery.data &&
			contentQuery.data.status == 200 &&
			contentQuery.data.data) ||
		null;

	if (!sources || !content) {
		return null;
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>From Other Sources</h2>
			<Tabs className={styles.tabs}>
				{sources.map((source) => (
					<Button
						key={`${source.pluginId} ${source.id}`}
						style={activeSource == source ? "primary" : "secondary"}
						onClick={() => setSourceId(`${source.pluginId}~${source.id}`)}
					>
						{source.name}
					</Button>
				))}
			</Tabs>
			{contentQuery.isPending ? (
				<div className={styles.loading}>
					<Spinner position="expand" />
				</div>
			) : content ? (
				<Content tracks={content.tracks} albums={content.albums} />
			) : (
				<h1>No Content</h1>
			)}
		</div>
	);
}

interface ContentProps {
	tracks: EphemeralTrack[];
	albums: Album[];
}

function Content({ tracks, albums }: ContentProps) {
	return (
		<div>
			{!!albums.length && (
				<HorizontalScroller heading="Albums">
					{albums.map((album, index) => {
						let key: string | number = index;
						const identity = album.identities?.[0];
						if (identity) {
							key = `${identity.pluginId} ${identity.identityId} ${identity.value}`;
						}

						return <GridAlbum album={album} key={key} />;
					})}
				</HorizontalScroller>
			)}
			{!!tracks.length && (
				<TrackList
					tracks={tracks}
					trackNumbers={tracks.map((_t, index) => index + 1)}
				/>
			)}
		</div>
	);
}
