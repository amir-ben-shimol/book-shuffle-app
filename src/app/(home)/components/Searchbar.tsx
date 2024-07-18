import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, Image, type NativeSyntheticEvent, type TextInputChangeEventData, Pressable, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { useUserStore } from '@/lib/store/useUserStore';
import { UISvg } from '@/ui/UISvg';

export type SearchbarHandle = {
	blurInput: () => void;
};

const Searchbar = forwardRef<SearchbarHandle>((_props, ref) => {
	const { user } = useUserStore();
	const { filterBooksQuery, setFilterBooksQuery } = useBooksStore();
	const [isFocused, setIsFocused] = useState(false);
	const textInputRef = useRef(null);

	const onSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		setFilterBooksQuery(e.nativeEvent.text);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const handleFocus = () => {
		setIsFocused(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	};

	const handleBlur = () => {
		setIsFocused(false);
		Keyboard.dismiss();
		// Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	};

	const handleClear = () => {
		setFilterBooksQuery('');
	};

	// Expose handleBlur to parent components via ref
	useImperativeHandle(ref, () => ({
		blurInput: handleBlur,
	}));

	const onNavigateToSettings = () => {
		router.push('/settings');
	};

	return (
		<View className="my-6 flex w-full flex-row items-center border-b border-gray-200 pb-4">
			<Pressable onPress={onNavigateToSettings}>
				{user?.avatarUrl ? (
					<Image source={{ uri: user.avatarUrl }} className="mr-2 h-10 w-10 rounded-full" />
				) : (
					<UISvg name="profileImagePlaceholder" className="mr-2 h-10 w-10 rounded-full" />
				)}
			</Pressable>

			<View className={`w flex flex-1 flex-row items-center rounded border bg-gray-200 px-2 py-2 ${isFocused ? 'border-blue-500' : 'border-gray-200'}`}>
				<Icon name="search" color="gray" size={24} />
				<TextInput
					ref={textInputRef}
					placeholder="Search for books"
					className="ml-2 w-5/6 text-start"
					value={filterBooksQuery}
					onChange={onSearch}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				{filterBooksQuery.length > 0 && (
					<Pressable onPress={handleClear}>
						<Icon name="cancel" color="gray" size={18} />
					</Pressable>
				)}
			</View>
		</View>
	);
});

export default Searchbar;
