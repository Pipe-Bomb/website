import { Spinner } from "@/components/spinner/spinner.component";
import styles from "./loading.module.scss";

export default function Loading() {
	return (
		<div className={styles.container}>
			<Spinner size="lg" position="expand" />
		</div>
	);
}
