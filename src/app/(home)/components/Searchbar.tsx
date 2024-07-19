import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, TextInput, Image, Pressable, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { useUserStore } from '@/lib/store/useUserStore';
import { UISvg } from '@/ui/UISvg';
import { debounce } from '@/lib/utils/debounce';

export type SearchbarHandle = {
	blurInput: () => void;
};

const Searchbar = forwardRef<SearchbarHandle>((_props, ref) => {
	const { user } = useUserStore();
	const { filterBooksQuery, setFilterBooksQuery } = useBooksStore();
	const [searchInputValueState, setSearchInputValueState] = useState(filterBooksQuery);
	const [isFocused, setIsFocused] = useState(false);
	const textInputRef = useRef<TextInput>(null);

	const debouncedSetFilterBooksQuery = useCallback(
		debounce((query: string) => {
			setFilterBooksQuery(query);
		}, 300),
		[],
	);

	const onSearch = (text: string) => {
		setSearchInputValueState(text);
		debouncedSetFilterBooksQuery(text);
	};

	const handleFocus = () => {
		setIsFocused(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	};

	const handleBlur = () => {
		setIsFocused(false);
		Keyboard.dismiss();
	};

	const handleClear = () => {
		setFilterBooksQuery('');
		setSearchInputValueState('');
		debouncedSetFilterBooksQuery.cancel();
	};

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

			<View
				className={`flex flex-1 flex-row items-center rounded border bg-gray-200 px-2 py-2 transition-all ${isFocused ? 'border-blue-500' : 'border-gray-200'}`}
			>
				<Icon name="search" color="gray" size={24} />
				<TextInput
					ref={textInputRef}
					placeholder="Search for books"
					className="ml-2 flex-1 text-start"
					placeholderTextColor="gray"
					value={searchInputValueState}
					onChangeText={onSearch}
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
