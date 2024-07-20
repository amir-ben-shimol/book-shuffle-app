import type { PropsWithChildren, ReactElement } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { UILinearGradient } from './UILinearGradient';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: string[];
}>;

export const UIParallaxScrollView = ({ children, headerImage, headerBackgroundColor }: Props) => {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
				},
				{
					scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
				},
			],
		};
	});

	return (
		<View className="pt-14">
			<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
				<Animated.View className="flex h-[310px] items-center justify-center overflow-hidden" style={[headerAnimatedStyle]}>
					<UILinearGradient className="absolute h-full w-full" gradientColors={headerBackgroundColor} />
					{headerImage}
				</Animated.View>
				<View className="flex-1 overflow-hidden">{children}</View>
			</Animated.ScrollView>
		</View>
	);
};
