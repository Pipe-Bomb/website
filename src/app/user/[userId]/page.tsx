import { getUser } from "@api";
import styles from "./page.module.scss";
import { RootPadding } from "@/components/root-padding/root-padding.component";
import { HorizontalScroller } from "@/components/horizontal-scroller/horizontal-scroller.component";
import { GridPlaylist } from "@/components/grid-playlist/grid-playlist.component";

interface Props {
	params: Promise<{ userId: string }>;
}

export default async function Page({ params }: Props) {
	const { userId } = await params;

	const userResponse = await getUser(userId);

	if (userResponse.status == 404) {
		return <h1>User not found</h1>;
	}

	const user = userResponse.data;

	return (
		<div>
			<RootPadding className={styles.top}>
				<h1 className={styles.username}>{user.username}</h1>
			</RootPadding>
			{!!user.playlists?.length && (
				<HorizontalScroller heading="Playlists">
					{user.playlists.map((playlist) => (
						<GridPlaylist playlist={playlist} key={playlist.uuid} />
					))}
				</HorizontalScroller>
			)}
		</div>
	);
}
