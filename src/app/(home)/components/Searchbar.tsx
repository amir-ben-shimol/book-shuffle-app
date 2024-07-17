import React, { useState } from 'react';
import { View, TextInput, type NativeSyntheticEvent, type TextInputChangeEventData, Pressable, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '@/lib/store/useBooksStore';

const Searchbar = () => {
	const { filterBooksQuery, setFilterBooksQuery } = useBooksStore();
	const [isFocused, setIsFocused] = useState(false);

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
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	};

	const handleClear = () => {
		setFilterBooksQuery('');
	};

	return (
		<View className="my-6 w-full border-b border-gray-200 pb-4">
			<View className={`flex w-full flex-row items-center rounded border bg-gray-200 px-2 py-2 ${isFocused ? 'border-blue-500' : 'border-gray-200'}`}>
				<Icon name="search" color="gray" size={24} />
				<TextInput
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
};

export default Searchbar;
