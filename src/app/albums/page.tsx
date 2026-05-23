import { AlbumGrid } from "@/components/album-grid/album-grid.component";
import { RootPadding } from "@/components/root-padding/root-padding.component";
import styles from "./page.module.scss";

export default function Page() {
	return (
		<RootPadding vertical>
			<h1 className={styles.title}>Albums</h1>
			<AlbumGrid />
		</RootPadding>
	);
}
