"use client";

import { useNotificationStore } from "@/store/notification.store";
import styles from "./notification-list.module.scss";
import { Notification } from "@/components/notification/notification.component";

export function NotificationList() {
	const { notifications } = useNotificationStore();

	return (
		<div className={styles.container}>
			{[...notifications].reverse().map((notification) => (
				<Notification notification={notification} key={notification.id} />
			))}
		</div>
	);
}
