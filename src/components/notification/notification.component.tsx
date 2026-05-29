import { Notification as INotification } from "@/store/notification.store";
import styles from "./notification.module.scss";
import { cc } from "@/lib/util";
import { useMemo } from "react";

interface Props {
	notification: INotification;
}

export function Notification({ notification }: Props) {
	const animationStyles = useMemo(() => {
		if (!notification.timeoutDuration || !notification.timeoutStart) {
			return undefined;
		}

		const delay = notification.timeoutStart - Date.now();

		return {
			animationDuration: `${notification.timeoutDuration}ms`,
			animationDelay: `${delay}ms`,
		};
	}, [
		notification.id,
		notification.timeoutStart,
		notification.timeoutDuration,
	]);

	return (
		<div className={cc(styles.size, notification.isClosing && styles.closing)}>
			<div className={styles.container}>
				<div className={styles.content}>
					<span className={styles.message}>{notification.message}</span>
					{!!notification.timeoutDuration && !!notification.timeoutStart && (
						<div className={styles.progressBar} style={animationStyles} />
					)}
				</div>
			</div>
		</div>
	);
}
