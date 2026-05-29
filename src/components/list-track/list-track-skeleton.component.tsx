import { IconButton } from "@/components/icon-button/icon-button";
import styles from "./list-track.module.scss";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

interface Props {
	number?: number;
	noArt?: boolean;
}

export function ListTrackSkeleton({ number, noArt }: Props) {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.trackNumberContainer}>
					<span className={styles.trackNumber}>{number}</span>
					<div className={styles.playButton}>
						<IconButton
							icon={IconPlayerPlayFilled}
							iconSource="tabler"
							disabled
						/>
					</div>
				</div>
				{!noArt && <div className={styles.imageContainer}></div>}
			</div>
		</div>
	);
}
