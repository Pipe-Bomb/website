import styles from "./icon-button.module.scss";
import { ComponentType, MouseEvent, SVGProps, useMemo } from "react";
import { cc } from "@/lib/util";

type ButtonStyle = "simple" | "background" | "ghost";
type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md" | "lg" | "xl";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Props = {
	icon: IconComponent;
	style?: ButtonStyle;
	onClick?: ((e: MouseEvent<HTMLElement>) => void) | null;
	loading?: boolean;
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
	iconSource: "lucide" | "tabler";
	iconClassName?: string;
};

const STYLE_CLASSES: Record<ButtonStyle, string> = {
	simple: "styleSimple",
	background: "styleBackground",
	ghost: "styleHost",
};

export function IconButton({
	icon,
	style,
	onClick,
	loading,
	variant,
	size,
	iconSource,
	disabled,
	iconClassName,
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
			onClick={onClick ?? undefined}
			disabled={disabled}
		>
			<IconComponent
				className={cc(styles.icon, styles[iconSource], iconClassName)}
				strokeWidth={2.5}
			/>
		</button>
	);
}
