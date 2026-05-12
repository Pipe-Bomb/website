import { ReactNode } from "react";
import styles from "./list.module.scss";
import { cc } from "@/lib/util";

interface Props {
	children?: ReactNode | ReactNode[];
	className?: string;
}

export function List({ children, className }: Props) {
	return <div className={cc(styles.container, className)}>{children}</div>;
}
