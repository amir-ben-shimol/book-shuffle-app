import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Notification, NotificationWithTimeout } from '../types/ui/notification';
import { DEFAULT_NOTIFICATION_DURATION, UNMOUNTING_NOTIFICATION_DURATION } from '../data/consts/notifications';

type State = {
	readonly notifications: NotificationWithTimeout[];
};

type Action = {
	readonly showNotification: (notification: Notification) => void;
	readonly unmountNotification: (id: number) => void;
	readonly pauseHidingNotification: (id: number) => void;
	readonly resumeHidingNotification: (id: number) => void;
	readonly resetStore: () => void;
};

type NotificationsStore = State & Action;

const notificationsStore = persist<NotificationsStore>(
	(set, get) => ({
		notifications: [],

		showNotification: (notification) => {
			const notificationId = Date.now();

			const newNotification: NotificationWithTimeout = {
				...notification,
				id: notificationId,
				isUnmounting: false,
				duration: notification.duration || DEFAULT_NOTIFICATION_DURATION,
				startTime: Date.now(),
				remainingDuration: notification.duration || DEFAULT_NOTIFICATION_DURATION,
			};

			set((state) => ({
				notifications: [...state.notifications, newNotification],
			}));

			newNotification.timeoutId = setTimeout(() => {
				get().unmountNotification(notificationId);
			}, newNotification.duration);
		},

		unmountNotification: (id) => {
			set((state) => ({
				notifications: state.notifications.map((n) => (n.id === id ? { ...n, isUnmounting: true } : n)),
			}));

			setTimeout(() => {
				set((state) => ({
					notifications: state.notifications.filter((n) => n.id !== id),
				}));
			}, UNMOUNTING_NOTIFICATION_DURATION);
		},

		pauseHidingNotification: (id) => {
			set((state) => {
				const currentTime = Date.now();

				return {
					notifications: state.notifications.map((n) => {
						if (n.id === id) {
							clearTimeout(n.timeoutId);

							return {
								...n,
								remainingDuration: n.remainingDuration - (currentTime - n.startTime),
							};
						}

						return n;
					}),
				};
			});
		},

		resumeHidingNotification: (id) => {
			set((state) => {
				const notification = state.notifications.find((n) => n.id === id);

				if (notification && notification.remainingDuration > 0) {
					const newTimeoutId = setTimeout(() => {
						get().unmountNotification(id);
					}, notification.remainingDuration);

					return {
						notifications: state.notifications.map((n) => {
							if (n.id === id) {
								return {
									...n,
									timeoutId: newTimeoutId,
									startTime: Date.now(),
								};
							}

							return n;
						}),
					};
				}

				return state;
			});
		},
		resetStore: () => {
			set({ notifications: [] });
		},
	}),
	{
		name: 'notificationsStore',
		storage: createJSONStorage(() => AsyncStorage),
	},
);

export const useNotificationsStore = create<NotificationsStore>()(notificationsStore);
