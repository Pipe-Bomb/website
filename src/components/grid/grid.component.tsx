import { ReactNode } from "react";
import styles from "./grid.module.scss";

interface Props {
	children: ReactNode[];
}

export function Grid({ children }: Props) {
	return <div className={styles.container}>{children}</div>;
}
