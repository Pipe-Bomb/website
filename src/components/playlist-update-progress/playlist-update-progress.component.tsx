"use client";

import { Playlist, useGetPlaylistUpdateProgress } from "@api";
import styles from "./playlist-update-progress.module.scss";
import { ProgressBar } from "@/components/progress-bar/progress-bar.component";
import { cc } from "@/lib/util";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
	playlist: Playlist;
	className?: string;
}

export function PlaylistUpdateProgress({ playlist, className }: Props) {
	const progressResponse = useGetPlaylistUpdateProgress(playlist.uuid, {
		query: {
			enabled: true,
			refetchInterval: 3_000,
		},
	});
	const router = useRouter();
	const pathname = usePathname();

	const previousSessionIds = useRef<Set<string>>(new Set());
	useEffect(() => {
		if (!progressResponse.data || progressResponse.data.status != 200) {
			return;
		}
		const sessions = progressResponse.data.data;
		const currentIds = new Set(sessions.map((s) => s.uuid));

		for (const previousId of previousSessionIds.current) {
			if (!currentIds.has(previousId)) {
				console.log("Session disappeared:", previousId);

				if (pathname == `/playlist/${playlist.uuid}`) {
					router.refresh();
				}
			}
		}

		previousSessionIds.current = currentIds;
	}, [progressResponse.data, pathname, playlist.uuid]);

	if (!progressResponse.data) {
		return null;
	}

	const data = progressResponse.data;

	if (data.status != 200 || !data.data.length) {
		return null;
	}

	return (
		<div className={cc(styles.container, className)}>
			{data.data.map((session) => (
				<ProgressBar
					percent={session.percent}
					loading={session.percent === null}
					key={session.uuid}
				/>
			))}
		</div>
	);
}
