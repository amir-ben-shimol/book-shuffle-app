import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { useUserStore } from '@/lib/store/useUserStore';
import { UISvg } from '@/ui/UISvg';
import { UIInput } from '@/ui/UIInput';

const Searchbar = () => {
	const { user } = useUserStore();
	const { setFilterBooksQuery } = useBooksStore();

	const onSetFilterBooksQuery = (query: string) => {
		setFilterBooksQuery(query);
	};

	const onClear = () => {
		setFilterBooksQuery('');
	};

	const onNavigateToSettings = () => {
		router.push('/settings');
	};

	return (
		<View className="my-6 flex w-full flex-row items-center border-b border-gray-200 pb-4">
			<Pressable onPress={onNavigateToSettings}>
				{user?.avatarUrl ? (
					<Image source={{ uri: user.avatarUrl }} className="mr-2 h-8 w-8 rounded-full" />
				) : (
					<UISvg name="profileImagePlaceholder" className="mr-2 h-8 w-8 rounded-full" />
				)}
			</Pressable>

			<UIInput
				placeholder="Search for books"
				className="ml-2 flex-1 text-start"
				placeholderTextColor="gray"
				icon="search"
				showClearButton
				debounceDelay={300}
				debounceCallback={onSetFilterBooksQuery}
				onClear={onClear}
			/>

			{/* <View
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
			</View> */}
		</View>
	);
};

export default Searchbar;
