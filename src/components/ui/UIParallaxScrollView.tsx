import React, { useEffect, useState, useImperativeHandle, forwardRef, type PropsWithChildren, type ReactElement } from 'react';
import { View, StatusBar, Text, type StatusBarStyle } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset, Extrapolation } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isDarkOrLight } from '@/lib/utils/check-color';
import { UILinearGradient } from './UILinearGradient';

const HEADER_HEIGHT = 250;
const TITLE_ANIMATION_START = HEADER_HEIGHT + 120; // Start the animation at the end of the header height
const TITLE_ANIMATION_END = TITLE_ANIMATION_START + 30; // Fully visible 30px after TITLE_ANIMATION_START

type Props = PropsWithChildren<{
	readonly headerImage: ReactElement;
	readonly childrenTitle?: string;
	readonly headerBackgroundColor: string[];
}>;

export const UIParallaxScrollView = forwardRef(({ children, childrenTitle, headerImage, headerBackgroundColor }: Props, ref) => {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const [statusBarColor, setStatusBarColor] = useState<StatusBarStyle>('default');

	useEffect(() => {
		if (headerBackgroundColor[0]) {
			const isDark = isDarkOrLight(headerBackgroundColor[0]);

			setStatusBarColor(isDark ? 'light-content' : 'dark-content');
		}
	}, [headerBackgroundColor]);

	useImperativeHandle(ref, () => ({
		scrollToTop: () => {
			scrollRef.current?.scrollTo({ y: 0, animated: true });
		},
	}));

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 1]),
				},
				{
					scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
				},
			],
		};
	});

	const titleAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollOffset.value, [TITLE_ANIMATION_START, TITLE_ANIMATION_END], [0, 1], Extrapolation.CLAMP);
		const translateY = interpolate(scrollOffset.value, [TITLE_ANIMATION_START, TITLE_ANIMATION_END], [-10, 0], Extrapolation.CLAMP);

		return {
			opacity,
			transform: [
				{
					translateY,
				},
			],
		};
	});

	return (
		<View className="relative">
			<SafeAreaView edges={['top']} style={{ backgroundColor: headerBackgroundColor[0] }} />
			<StatusBar barStyle={statusBarColor} />
			<Animated.View
				className="absolute top-9 z-50 flex w-full items-center pb-2 pt-6 shadow-lg"
				style={[{ backgroundColor: headerBackgroundColor[0] }, titleAnimatedStyle]}
			>
				<Text className="px-2 text-center text-2xl font-semibold text-white" style={{ fontFamily: 'Georgia' }}>
					{childrenTitle}
				</Text>
			</Animated.View>

			<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
				<Animated.View className="flex h-[380px] items-center justify-center overflow-hidden" style={[headerAnimatedStyle]}>
					<UILinearGradient className="absolute h-full w-full" gradientColors={headerBackgroundColor} />
					{headerImage}
				</Animated.View>
				<View className="relative flex-1 overflow-hidden">{children}</View>
			</Animated.ScrollView>
		</View>
	);
});
