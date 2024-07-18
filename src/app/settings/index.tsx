import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useUserStore } from '@/lib/store/useUserStore';
import type { User } from '@/lib/types/ui/user';

const SettingsPage: React.FC = () => {
	const { user, setUser } = useUserStore();
	const [editingUser, setEditingUser] = useState<User | null>(user);
	const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
	const [isModified, setIsModified] = useState(false);
	const waveAnimation = useSharedValue(0);

	useEffect(() => {
		waveAnimation.value = withRepeat(
			withSequence(withTiming(-15, { duration: 300, easing: Easing.ease }), withTiming(15, { duration: 300, easing: Easing.ease })),
			-1,
			true,
		);
	}, [waveAnimation]);

	const handleChange = useCallback(
		(key: keyof User, value: string) => {
			if (editingUser) {
				const updatedUser = { ...editingUser, [key]: value };

				setEditingUser(updatedUser);
				checkIfModified(updatedUser);
			} else {
				const newUser = { [key]: value } as unknown as User;

				setEditingUser(newUser);
				setIsModified(true);
			}
		},
		[editingUser],
	);

	const checkIfModified = useCallback(
		(updatedUser: User) => {
			const hasChanges =
				updatedUser.firstName !== user?.firstName ||
				updatedUser.lastName !== user?.lastName ||
				updatedUser.email !== user?.email ||
				avatarUrl !== user?.avatarUrl;

			setIsModified(hasChanges);
		},
		[user, avatarUrl],
	);

	const handleSave = useCallback(() => {
		if (editingUser) {
			setUser({ ...editingUser, avatarUrl });
			setIsModified(false);
		}
	}, [editingUser, avatarUrl, setUser]);

	const handleImagePicker = useCallback(async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets[0]) {
			setAvatarUrl(result.assets[0].uri);
			setUser({ ...editingUser, avatarUrl: result.assets[0].uri } as User);
			// checkIfModified({ ...editingUser, avatarUrl: result.assets[0].uri } as User);
		}
	}, [editingUser, setUser]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${waveAnimation.value}deg` }],
		};
	});

	return (
		<View className="flex-1 bg-gray-100 p-4">
			<View className="mb-4 flex flex-row items-center">
				<Text className="ml-2 text-3xl font-semibold">{`Hello ${user?.firstName}`}</Text>
				<Animated.Text style={[animatedStyle, { fontSize: 30 }]}>👋</Animated.Text>
			</View>

			<Pressable onPress={handleImagePicker}>
				<View className="mb-4 items-center">
					{avatarUrl ? (
						<Image source={{ uri: avatarUrl }} className="h-24 w-24 rounded-full" />
					) : (
						<View className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
							<Text className="text-gray-600">Upload Avatar</Text>
						</View>
					)}
				</View>
			</Pressable>

			<View className="mb-4">
				<Text className="mb-2">First Name</Text>
				<TextInput
					className="rounded border border-gray-300 bg-white p-2"
					value={editingUser?.firstName}
					onChangeText={(text) => handleChange('firstName', text)}
				/>
			</View>

			<View className="mb-4">
				<Text className="mb-2">Last Name</Text>
				<TextInput
					className="rounded border border-gray-300 bg-white p-2"
					value={editingUser?.lastName}
					onChangeText={(text) => handleChange('lastName', text)}
				/>
			</View>

			<View className="mb-4">
				<Text className="mb-2">Email</Text>
				<TextInput
					className="rounded border border-gray-300 bg-white p-2"
					value={editingUser?.email}
					onChangeText={(text) => handleChange('email', text)}
				/>
			</View>

			<Pressable className={`items-center rounded p-2 ${isModified ? 'bg-blue-500' : 'bg-gray-500'}`} disabled={!isModified} onPress={handleSave}>
				<Text className="font-semibold text-white">Save</Text>
			</Pressable>
		</View>
	);
};

export default React.memo(SettingsPage);
