import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { useUserStore } from '@/lib/store/useUserStore';
import { UISvg } from '@/ui/UISvg';
import { UIInput } from '@/ui/UIInput';

type Props = {
	readonly isActive: boolean;
	readonly onActivate?: VoidFunction;
	readonly onDeactivate?: VoidFunction;
};

const Searchbar = (props: Props) => {
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
		<View className={`my-6 flex w-full flex-row items-center ${!props.isActive && 'border-b border-gray-200 pb-4'}`}>
			<Pressable onPress={onNavigateToSettings}>
				{user?.avatarUrl ? (
					<Image source={{ uri: user.avatarUrl }} className="mr-2 h-8 w-8 rounded-full" />
				) : (
					<UISvg name="profileImagePlaceholder" className="mr-2 h-8 w-8 rounded-full" />
				)}
			</Pressable>
			<View className="flex-1">
				<UIInput
					placeholder="Search for books"
					className="text-start"
					placeholderTextColor="gray"
					icon="search"
					showClearButton
					showCancelButton
					debounceDelay={300}
					isActive={props.isActive}
					debounceCallback={onSetFilterBooksQuery}
					onClear={onClear}
					onActivate={props.onActivate}
					onDeactivate={props.onDeactivate}
				/>
			</View>
		</View>
	);
};

export default Searchbar;
