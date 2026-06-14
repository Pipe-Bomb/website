"use client";

import {
	getAllPlaylistTrackIds,
	Playlist,
	runPlaylistSmartFilters,
} from "@api";
import styles from "./playlist-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconDots, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { ListEndIcon, ListStartIcon, ShuffleIcon } from "lucide-react";
import { useIsMounted } from "@/hook/mounted.hook";
import { useQueueActions } from "@/hook/queue-actions.hook";
import { shuffle } from "@/lib/util";
import { useButtonMenu } from "@/hook/button-menu.hook";
import { usePathname, useRouter } from "next/navigation";

interface Props {
	playlist: Playlist;
}

export function PlaylistButtons({ playlist }: Props) {
	const { playEntireList, playListNext, addToEnd } = useQueueActions();
	const isMounted = useIsMounted();
	const [isLoadingTracklist, setIsLoadingTracklist] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	const tracklist = useMemo(() => {
		return playlist.tracks?.map(({ track }) => track) ?? null;
	}, [playlist.tracks]);

	const getFullTracklist = useCallback(async () => {
		if (
			tracklist &&
			playlist.trackCount !== null &&
			tracklist.length >= playlist.trackCount
		) {
			return tracklist;
		}
		setIsLoadingTracklist(true);

		try {
			const response = await getAllPlaylistTrackIds(playlist.uuid);
			if (response.status != 200) {
				throw new Error(`Status code ${response.status}`);
			}
			return response.data.map(({ track }) => track);
		} finally {
			setIsLoadingTracklist(false);
		}
	}, [playlist, playlist.trackCount]);

	const { onClick } = useButtonMenu(() => [
		{
			key: "rename",
			languageKey: "contextmenu.playlist.rename",
			onClick: () => {},
		},
		{
			key: "change-thumb",
			languageKey: "contextmenu.playlist.change-thumbnail",
			onClick: () => {},
		},
		{
			key: "scan-smart-filters",
			languageKey: "contextmenu.playlist.scan-smart-filters",
			onClick: () => {
				runPlaylistSmartFilters(playlist.uuid)
					.then(() => {
						if (pathname == `/playlist/${playlist.uuid}`) {
							router.refresh();
						}
					})
					.catch(console.error);
			},
		},
	]);

	return (
		<>
			<div className={styles.container}>
				{isMounted && (
					<>
						<IconButton
							size="xl"
							style="background"
							icon={IconPlayerPlayFilled}
							iconSource="tabler"
							onClick={() =>
								getFullTracklist().then((tracklist) =>
									playEntireList(tracklist ?? [], 0),
								)
							}
							disabled={!tracklist}
							loading={isLoadingTracklist}
						/>
						<IconButton
							size="md"
							icon={ShuffleIcon}
							iconSource="lucide"
							onClick={() =>
								getFullTracklist().then((tracklist) =>
									playEntireList(shuffle(tracklist), 0),
								)
							}
							disabled={!tracklist}
						/>
						<IconButton
							size="md"
							icon={ListStartIcon}
							iconSource="lucide"
							onClick={() =>
								getFullTracklist().then((tracklist) =>
									playListNext(tracklist ?? []),
								)
							}
							disabled={!tracklist}
						/>
						<IconButton
							size="md"
							icon={ListEndIcon}
							iconSource="lucide"
							onClick={() =>
								getFullTracklist().then((tracklist) =>
									addToEnd(tracklist ?? []),
								)
							}
							disabled={!tracklist}
						/>
						<IconButton
							size="md"
							icon={IconDots}
							iconSource="tabler"
							onClick={onClick}
						/>
					</>
				)}
			</div>
		</>
	);
}
