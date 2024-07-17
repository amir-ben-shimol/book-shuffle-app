import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const BottomTabsNavigator: React.FC = () => {
	const rotation = useSharedValue(0);
	const pressRotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withSequence(
				withTiming(45, { duration: 1000 }),
				withTiming(0, { duration: 1000 }),
				withTiming(0, { duration: 3000 }), // Pausing for 3 seconds
			),
			-1,
			false,
		);
	}, [rotation]);

	const handlePress = () => {
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
		<Tabs
			sceneContainerStyle={{ backgroundColor: 'white' }}
			screenOptions={{
				tabBarActiveTintColor: 'navy',
				tabBarIconStyle: { marginBottom: -15 },
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
					tabBarLabel: 'Home',
					tabBarLabelStyle: { fontSize: 12, position: 'absolute', bottom: -10, fontWeight: '500' },
				}}
			/>
			<Tabs.Screen
				name="shuffle"
				options={{
					tabBarIcon: () => (
						<Pressable onPress={handlePress}>
							<View className="mb-10 h-16 w-16 rounded-full bg-white p-2">
								<View className="flex items-center justify-center rounded-full bg-blue-300 p-2">
									<Animated.View style={animatedStyle}>
										<Text className="text-3xl">📚</Text>
									</Animated.View>
								</View>
							</View>
						</Pressable>
					),
					tabBarLabel: 'Shuffle',
					tabBarLabelStyle: { fontSize: 12, position: 'absolute', bottom: -10, fontWeight: '500' },
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
	);
};

export default BottomTabsNavigator;
