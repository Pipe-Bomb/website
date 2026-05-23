import { ArtistGrid } from "@/components/artist-grid/artist-grid.component";
import { RootPadding } from "@/components/root-padding/root-padding.component";
import styles from "./page.module.scss";

export default function Page() {
	return (
		<RootPadding vertical>
			<h1 className={styles.title}>Artists</h1>
			<ArtistGrid />
		</RootPadding>
	);
}
