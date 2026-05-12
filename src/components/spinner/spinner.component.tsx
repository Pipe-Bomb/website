import { cc } from "@/lib/util";
import styles from "./spinner.module.scss";
import { useMemo } from "react";

type SpinnerPosition = "absolute" | "normal" | "expand";

interface Props {
	position?: SpinnerPosition;
}

const POSITION_CLASSES: Record<SpinnerPosition, string> = {
	absolute: "positionAbsolute",
	normal: "positionNormal",
	expand: "positionExpand",
};

export function Spinner({ position }: Props) {
	const positionClass = useMemo(
		() => styles[POSITION_CLASSES[position ?? "normal"]],
		[position],
	);

	return (
		<div className={cc(styles.container, positionClass)}>
			<div className={styles.spinner} />
		</div>
	);
}
