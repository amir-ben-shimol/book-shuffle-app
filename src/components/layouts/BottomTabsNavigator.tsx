import React, { useEffect } from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router, Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { UILinearGradient } from '@/ui/UILinearGradient';

const BottomTabsNavigator: React.FC = () => {
	const rotation = useSharedValue(0);
	const pressRotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withSequence(
				withTiming(45, { duration: 250 }),
				withTiming(-20, { duration: 250 }),
				withTiming(20, { duration: 250 }),
				withTiming(0, { duration: 250 }),
				withTiming(0, { duration: 500 }),
				withTiming(0, { duration: 1500 }),
			),
			-1,
			false,
		);
	}, [rotation]);

	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

		pressRotation.value = withSequence(
			withTiming(360, { duration: 500, easing: Easing.in(Easing.ease) }),
			withTiming(720, { duration: 500, easing: Easing.out(Easing.ease) }),
			withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }),
		);

		//navigate to shuffle screen
		router.navigate('shuffle');
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value + pressRotation.value}deg` }],
		};
	});

	return (
		<>
			<StatusBar barStyle="dark-content" />
			<Tabs
				sceneContainerStyle={{ backgroundColor: '#f1f5f9' }}
				screenOptions={{
					tabBarActiveTintColor: '#3b82f6',
					tabBarIconStyle: { marginBottom: -15 },
					headerShown: false,
					unmountOnBlur: true,
				}}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
						tabBarLabel: 'Home',
						tabBarLabelStyle: { fontSize: 12, position: 'absolute', bottom: -10, fontWeight: '500' },
						unmountOnBlur: true,
					}}
				/>
				<Tabs.Screen
					name="shuffle"
					options={{
						tabBarIcon: () => (
							<Pressable onPress={handlePress}>
								<View className="mb-10 h-16 w-16 rounded-full bg-white p-2">
									<UILinearGradient
										gradientColors={['#60a5fa', '#3b82f6']}
										className="flex items-center justify-center rounded-full bg-blue-300 p-2"
									>
										<Animated.View style={animatedStyle}>
											<Text className="text-3xl">📚</Text>
										</Animated.View>
									</UILinearGradient>
								</View>
							</Pressable>
						),
						tabBarLabel: 'Shuffle',
						tabBarLabelStyle: { fontSize: 12, position: 'absolute', bottom: -10, fontWeight: '500' },
						headerTintColor: 'black',
						unmountOnBlur: true,
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						tabBarIcon: ({ color, size }) => <Icon name="settings" color={color} size={size} />,
						tabBarLabel: 'Settings',
						tabBarLabelStyle: { fontSize: 12, position: 'absolute', bottom: -10, fontWeight: '500' },
					}}
				/>
			</Tabs>
		</>
	);
};

export default BottomTabsNavigator;
