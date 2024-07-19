import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useUserStore } from '@/lib/store/useUserStore';
import type { User } from '@/lib/types/ui/user';
import { launchImagePicker } from '@/lib/utils/image-picker';

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
		const uploadedImage = await launchImagePicker();

		if (!uploadedImage) return;

		setAvatarUrl(uploadedImage);
		setUser({ ...editingUser, avatarUrl: uploadedImage } as User);
	}, [editingUser, setUser]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${waveAnimation.value}deg` }],
		};
	});

	const onClearAsyncStorage = () => {
		AsyncStorage.clear();
		console.log('AsyncStorage cleared');
	};

	return (
		<View className="flex-1 bg-gray-100 p-4">
			<View className="mb-4 flex flex-row items-center">
				<Text className="ml-2 text-3xl font-semibold">{`Hello ${user?.firstName}`}</Text>
				<Animated.Text style={[animatedStyle, { fontSize: 30 }]}>👋</Animated.Text>
			</View>

			<Pressable className="self-center shadow-lg" onPress={handleImagePicker}>
				{avatarUrl ? (
					<Image source={{ uri: avatarUrl }} className="h-24 w-24 rounded-full" />
				) : (
					<View className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
						<Text className="text-gray-600">Upload Avatar</Text>
					</View>
				)}
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

			<Pressable className="my-8 items-center rounded bg-red-500 p-2" onPress={onClearAsyncStorage}>
				<Text className="font-semibold text-white">Clear storage</Text>
			</Pressable>

			<Pressable className={`my-8 items-center rounded p-2 ${isModified ? 'bg-blue-500' : 'bg-gray-500'}`} disabled={!isModified} onPress={handleSave}>
				<Text className="font-semibold text-white">Save</Text>
			</Pressable>
		</View>
	);
};

export default React.memo(SettingsPage);
