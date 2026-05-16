import { Icon } from "@tabler/icons-react";
import styles from "./icon-button.module.scss";
import { useMemo } from "react";
import { cc } from "@/lib/util";

type ButtonStyle = "simple" | "background";
type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md" | "lg" | "xl";

type Props = {
	icon: Icon;
	style?: ButtonStyle;
	onClick?: () => void;
	loading?: boolean;
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
};

const STYLE_CLASSES: Record<ButtonStyle, string> = {
	simple: "styleSimple",
	background: "styleBackground",
};

export function IconButton({
	icon,
	style,
	onClick,
	loading,
	variant,
	size,
}: Props) {
	const IconComponent = icon;
	const styleClass = useMemo(
		() => styles[STYLE_CLASSES[style ?? "simple"]],
		[style],
	);
	const variantClass = useMemo(() => styles[variant ?? "primary"], [variant]);
	const sizeClass = useMemo(() => styles[size ?? "md"], [size]);

	return (
		<button
			className={cc(
				styles.button,
				styleClass,
				variantClass,
				sizeClass,
				loading && styles.loading,
			)}
			onClick={onClick}
		>
			<IconComponent className={styles.icon} />
		</button>
	);
}
