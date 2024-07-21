import React, { type PropsWithChildren, type ReactElement } from 'react';
import { View, StatusBar, Text } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UILinearGradient } from './UILinearGradient';

const HEADER_HEIGHT = 250;
const TITLE_ANIMATION_START = HEADER_HEIGHT + 120; // Start the animation at the end of the header height
const TITLE_ANIMATION_END = TITLE_ANIMATION_START + 30; // Fully visible 100px after the end of the header

type Props = PropsWithChildren<{
	readonly headerImage: ReactElement;
	readonly childrenTitle?: string;
	readonly headerBackgroundColor: string[];
}>;

export const UIParallaxScrollView = ({ children, childrenTitle, headerImage, headerBackgroundColor }: Props) => {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

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
		const opacity = interpolate(scrollOffset.value, [TITLE_ANIMATION_START, TITLE_ANIMATION_END], [0, 1]);

		return {
			opacity,
		};
	});

	return (
		<View className="relative">
			<SafeAreaView edges={['top']} style={{ backgroundColor: headerBackgroundColor[0] }} />
			<StatusBar barStyle="dark-content" />
			<Animated.View
				className="absolute top-14 z-50 flex w-full items-center py-2 shadow-lg"
				style={[{ backgroundColor: headerBackgroundColor[0] }, titleAnimatedStyle]}
			>
				<Text className="text-2xl text-white" style={{ fontFamily: 'Georgia' }}>
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
};
