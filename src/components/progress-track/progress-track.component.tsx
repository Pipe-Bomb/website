import { CSSProperties, useMemo } from "react";
import styles from "./progress-track.module.scss";
import { cc } from "@/lib/util";

interface Props {
	max: number;
	value: number;
	loading?: boolean;
	onChange?: (value: number) => void;
}

export function ProgressTrack({ max, value, loading, onChange }: Props) {
	const percent = useMemo(() => (value / max) * 100, [max, value]);

	const style = {
		"--percent": `${percent}%`,
		"--center-offset": `${(percent - 50) / -50}`,
	} as CSSProperties;

	return (
		<div
			className={cc(styles.container, loading && styles.isLoading)}
			style={style}
		>
			<input
				type="range"
				className={styles.input}
				step={0.1}
				value={value}
				max={max}
				onChange={(e) => {
					onChange?.(Number(e.currentTarget.value));
				}}
			/>
			<div className={styles.track}>
				<div className={styles.progress} />
				<div className={styles.loading} />
			</div>
			<div className={styles.thumb} />
		</div>
	);
}
