import { randomString } from "@/lib/util";
import { create } from "zustand";

export interface Notification {
	id: string;
	message: string;
	timeoutStart: number | null;
	timeoutDuration: number | null;
	timeout: ReturnType<typeof setTimeout> | null;
	isLoading: boolean;
	isClosing: boolean;
}

interface NotificationStore {
	notifications: Notification[];

	createNotification(
		message: string,
		options?: {
			timeout?: number | null;
			isLoading?: boolean;
		},
	): string;

	removeNotification(id: string): void;

	setNotificationTimeout(id: string, timeout: number | null): void;

	resetNotificationTimeout(id: string): void;

	updateNotification(
		id: string,
		options: {
			message?: string;
			isLoading?: boolean;
		},
	): void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	notifications: [],

	createNotification(message, options = {}) {
		const existingIds = get().notifications.map(({ id }) => id);
		let id: string;
		do {
			id = randomString(10);
		} while (existingIds.includes(id));

		set(({ notifications }) => ({
			notifications: [
				...notifications,
				{
					id,
					message,
					timeoutStart: null,
					timeoutDuration: null,
					timeout: null,
					isLoading: !!options.isLoading,
					isClosing: false,
				},
			],
		}));

		if (options.timeout === undefined) {
			get().resetNotificationTimeout(id);
		} else if (options.timeout) {
			get().setNotificationTimeout(id, options.timeout);
		}

		return id;
	},

	removeNotification(id) {
		set(({ notifications }) => ({
			notifications: notifications.map((notification) => {
				if (notification.id != id || notification.isClosing) {
					return notification;
				}

				setTimeout(() => {
					set(({ notifications }) => ({
						notifications: notifications.filter(
							(notification) => notification.id != id,
						),
					}));
				}, 1_000);

				return {
					...notification,
					isClosing: true,
				};
			}),
		}));
	},

	setNotificationTimeout(id, timeout) {
		set(({ notifications }) => ({
			notifications: notifications.map((notification) => {
				if (notification.id != id || notification.isClosing) {
					return notification;
				}

				if (notification.timeout) {
					clearTimeout(notification.timeout);
				}

				if (!timeout) {
					return {
						...notification,
						timeout: null,
						timeoutDuration: null,
						timeoutStart: null,
					};
				}

				return {
					...notification,
					timeout: setTimeout(() => get().removeNotification(id), timeout),
					timeoutStart: Date.now(),
					timeoutDuration: timeout,
				};
			}),
		}));
	},

	resetNotificationTimeout(id) {
		get().setNotificationTimeout(id, 5_000);
	},

	updateNotification(id, options) {
		set(({ notifications }) => ({
			notifications: notifications.map((notification) => {
				if (notification.id != id || notification.isClosing) {
					return notification;
				}

				return {
					...notification,
					message: options.message ?? notification.message,
					isLoading: options.isLoading ?? notification.isLoading,
				};
			}),
		}));
	},
}));
