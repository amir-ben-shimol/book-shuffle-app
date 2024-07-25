export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationWithTimeout = Notification & {
	timeoutId?: NodeJS.Timeout;
	readonly remainingDuration: number;
	readonly startTime: number;
};

export type Notification = {
	readonly id?: number;
	readonly type: NotificationType;
	readonly title: string;
	readonly duration: number;
	readonly content?: string;
	readonly isUnmounting?: boolean;
};
