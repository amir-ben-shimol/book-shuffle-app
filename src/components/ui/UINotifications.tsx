import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, cancelAnimation, runOnJS } from 'react-native-reanimated';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';
import { cn } from '@/lib/utils/component';
import type { Notification as TNotification, NotificationType } from '@/types/ui/notification';

const Notification = (notification: TNotification) => {
	const { unmountNotification, pauseHidingNotification, resumeHidingNotification } = useNotificationsStore();
	const [hoverStatus, setHoverStatus] = useState<Record<number, boolean>>({});

	const translateX = useSharedValue(notification.isUnmounting ? 0 : -500);
	const opacity = useSharedValue(notification.isUnmounting ? 1 : 0);
	const expandWidth = useSharedValue(0);

	const durationInSeconds = notification.duration || 5000;

	useEffect(() => {
		translateX.value = withTiming(notification.isUnmounting ? 500 : 0, {
			duration: 750,
			easing: Easing.out(Easing.exp),
		});
		opacity.value = withTiming(notification.isUnmounting ? 0 : 1, {
			duration: 1000,
			easing: Easing.out(Easing.exp),
		});

		const animation = withTiming(100, {
			duration: durationInSeconds,
			easing: Easing.linear,
		});

		if (hoverStatus[notification.id!]) {
			cancelAnimation(expandWidth);
		} else {
			expandWidth.value = animation;
		}
	}, [notification.isUnmounting, hoverStatus[notification.id!]]);

	const slideInStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
			opacity: opacity.value,
		};
	});

	const backgroundStyle = useAnimatedStyle(() => {
		return {
			width: `${expandWidth.value}%`,
		};
	});

	const containerClasses = () => {
		return `relative flex w-full flex-col items-center justify-center  mb-4 overflow-hidden border-l-8 rounded-lg transition-all duration-300 ease-in-out
            ${notification.type === 'info' ? 'bg-gray-800 border-gray-700' : ''}
            ${notification.type === 'success' ? 'bg-green-100 border-green-600' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-100 border-yellow-500' : ''}
            ${notification.type === 'error' ? 'bg-red-100 border-red-600' : ''}`;
	};

	const textColorClasses = (type: NotificationType) => {
		return `${type === 'info' ? 'text-gray-100' : ''}
            ${type === 'success' ? 'text-green-600' : ''}
            ${type === 'warning' ? 'text-yellow-500' : ''}
            ${type === 'error' ? 'text-red-600' : ''}`;
	};

	const timerBackgroundClasses = (type: NotificationType) => {
		return `absolute h-full insert-0 rounded-br-lg opacity-20 w-1/2
            ${type === 'info' ? 'bg-gray-600' : ''}
            ${type === 'success' ? 'bg-green-600' : ''}
            ${type === 'warning' ? 'bg-yellow-500' : ''}
            ${type === 'error' ? 'bg-red-600' : ''}`;
	};

	const handleMouseEnter = () => {
		pauseHidingNotification(notification.id!);
		setHoverStatus((prev) => ({ ...prev, [notification.id!]: true }));
	};

	const handleMouseLeave = () => {
		resumeHidingNotification(notification.id!);
		setHoverStatus((prev) => ({ ...prev, [notification.id!]: false }));
	};

	const tapGesture = Gesture.Tap().onEnd(() => {
		runOnJS(unmountNotification)(notification.id!);
	});

	const panGesture = Gesture.Pan()
		.onBegin(() => {
			runOnJS(handleMouseEnter)();
		})
		.onUpdate((event) => {
			translateX.value = event.translationX;
		})
		.onEnd((event) => {
			if (Math.abs(event.translationX) > 100) {
				runOnJS(unmountNotification)(notification.id!);
			} else {
				translateX.value = withTiming(0, {
					duration: 500,
					easing: Easing.out(Easing.exp),
				});
			}
		})
		.onFinalize(() => {
			runOnJS(handleMouseLeave)();
		});

	const composedGesture = Gesture.Simultaneous(tapGesture, panGesture);

	return (
		<GestureDetector gesture={composedGesture}>
			<Animated.View style={slideInStyle} className={containerClasses()}>
				<View className="w-full">
					<View className="w-full px-4 py-2">
						<Text className={cn('z-10 text-sm font-medium', textColorClasses(notification.type))}>{notification.title}</Text>
						<Text className={cn('z-10 text-xs', textColorClasses(notification.type))}>{notification.content}</Text>
					</View>
					<Animated.View style={backgroundStyle} className={timerBackgroundClasses(notification.type)} />
				</View>
			</Animated.View>
		</GestureDetector>
	);
};

export const UINotifications = () => {
	const { notifications } = useNotificationsStore();

	if (notifications.length === 0) return null;

	return (
		<View className="absolute bottom-0 z-30 flex w-full flex-col self-center">
			{notifications.map((notification) => {
				if (!notification.id) return null;

				return <Notification key={notification.id} {...notification} />;
			})}
		</View>
	);
};
