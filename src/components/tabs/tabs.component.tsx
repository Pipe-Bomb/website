import { ReactNode } from "react";
import styles from "./tabs.module.scss";
import { cc } from "@/lib/util";

interface Props {
	children: ReactNode[] | ReactNode;
	className?: string;
}

export function Tabs({ children, className }: Props) {
	return <div className={cc(styles.container, className)}>{children}</div>;
}
