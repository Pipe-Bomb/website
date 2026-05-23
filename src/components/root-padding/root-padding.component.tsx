import { ReactNode } from "react";
import styles from "./root-padding.module.scss";
import { cc } from "@/lib/util";

interface Props {
	children?: ReactNode;
	className?: string;
	vertical?: boolean;
}

export function RootPadding({ children, className, vertical }: Props) {
	return (
		<div
			className={cc(styles.container, vertical && styles.vertical, className)}
		>
			{children}
		</div>
	);
}
