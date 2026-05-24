"use client";

import {
	useGetAlbumEphemeralContent,
	useGetAlbumEphemeralContentByIdentity,
	useGetAlbumEphemeralSources,
} from "@api";
import styles from "./ephemeral-content-tabs.module.scss";
import { useEffect, useMemo } from "react";
import { Spinner } from "@/components/spinner/spinner.component";
import { Tabs } from "@/components/tabs/tabs.component";
import { Button } from "@/components/button/button.component";
import { SearchResults } from "@/components/search-results/search-results.component";
import { useUrlParam } from "@/hook/url-param.hook";
import { TrackList } from "@/components/track-list/track-list.component";
import { useTrackListContext } from "@/context/tracklist.context";

interface Props {
	albumId: string;
}

export function AlbumEphemeralContentTabs({ albumId }: Props) {
	if (albumId.includes("~")) {
		const parts = albumId.split("~");
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
		return <ViaUuid uuid={albumId} />;
	}

	return null;
}

interface ViaIdentityProps {
	pluginId: string;
	identifierId: string;
	identity: string;
}

function ViaIdentity({ pluginId, identifierId, identity }: ViaIdentityProps) {
	const sources = useGetAlbumEphemeralContentByIdentity();
	const { setTrackList } = useTrackListContext();

	useEffect(() => {
		sources.mutate({
			pluginId,
			identifierId,
			identity,
		});
	}, [pluginId, identifierId, identity]);

	const data = sources.data;

	useEffect(() => {
		if (data && data.status == 200) {
			setTrackList(data.data.tracks);
		} else {
			setTrackList([]);
		}
	}, [data]);

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

	const { tracks, source } = data.data;

	return (
		<div>
			<span className={styles.originMessage}>Tracklist from {source.name}</span>
			<TrackList
				tracks={tracks}
				trackNumbers={tracks.map((_t, index) => index + 1)}
			/>
		</div>
	);
}

interface ViaUuid {
	uuid: string;
}

function ViaUuid({ uuid }: ViaUuid) {
	const sourcesQuery = useGetAlbumEphemeralSources(uuid);
	const sources = useMemo(() => {
		console.log(sourcesQuery.data);
		if (sourcesQuery.data && sourcesQuery.data.status == 200) {
			return sourcesQuery.data.data;
		}
		return null;
	}, [sourcesQuery.data]);
	const contentQuery = useGetAlbumEphemeralContent();
	const { setTrackList } = useTrackListContext();

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
				albumUuid: uuid,
				data: {
					pluginId: activeSource.pluginId,
					sourceId: activeSource.id,
				},
			});
		} else {
			contentQuery.reset();
		}
	}, [activeSource, uuid]);

	const content =
		(contentQuery.data &&
			contentQuery.data.status == 200 &&
			contentQuery.data.data) ||
		null;

	useEffect(() => {
		if (content) {
			setTrackList(content.tracks);
		} else {
			setTrackList([]);
		}
	}, [content]);

	if (sourcesQuery.isPending || contentQuery.isPending) {
		return (
			<div className={styles.loading}>
				<Spinner position="expand" />
			</div>
		);
	}

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
				<SearchResults tracks={content.tracks} artists={[]} albums={[]} />
			) : (
				<h1>No Content</h1>
			)}
		</div>
	);
}
