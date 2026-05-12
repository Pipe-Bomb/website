import styles from "./progress-bar.module.scss";

interface Props {
	percent: number | null;
	loading?: boolean;
}

export function ProgressBar({ percent, loading }: Props) {
	return (
		<div className={styles.container}>
			{loading ? (
				<div className={styles.loading} />
			) : (
				typeof percent == "number" && (
					<div
						className={styles.progress}
						style={{
							width: `${percent}%`,
						}}
					/>
				)
			)}
		</div>
	);
}
