import { cc } from "@/lib/util";
import styles from "./spinner.module.scss";
import { useMemo } from "react";

type SpinnerPosition = "absolute" | "normal" | "expand";

interface Props {
	position?: SpinnerPosition;
	color?: "accent" | "dark";
	size?: "xs" | "sm" | "md" | "lg";
}

const POSITION_CLASSES: Record<SpinnerPosition, string> = {
	absolute: "positionAbsolute",
	normal: "positionNormal",
	expand: "positionExpand",
};

export function Spinner({ position, color, size }: Props) {
	const positionClass = useMemo(
		() => styles[POSITION_CLASSES[position ?? "normal"]],
		[position],
	);

	const colorClass = useMemo(() => styles[color ?? "dark"], [color]);

	const sizeClass = useMemo(() => styles[size ?? "md"], [size]);

	return (
		<div className={cc(styles.container, positionClass, colorClass, sizeClass)}>
			<div className={styles.spinner} />
		</div>
	);
}
