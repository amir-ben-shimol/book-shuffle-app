import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { FilterTabs } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { SearchNewBookModal } from '@/modals/SearchNewBookModal';
import { FilterModal } from '@/modals/FilterModal';
import { onBlurActiveInput } from '@/lib/utils/input';

const Filterbar = () => {
	const { selectedFilterTab, allBooksFilters, setFilterTab } = useBooksStore();
	const [filterTabState, setFilterTabState] = useState<FilterTabs>(selectedFilterTab);
	const [isFilterVisible, setIsFilterVisible] = useState(false);
	const translateX = useSharedValue(selectedFilterTab === 'all' ? -40 : 25);
	const [isAddNewBookModalVisible, setIsAddNewBookModalVisible] = useState(false);

	const onCloseAddNewBookModal = () => {
		setIsAddNewBookModalVisible(false);
	};

	const handlePress = (tab: FilterTabs, position: number) => {
		setFilterTabState(tab);
		setFilterTab(tab);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		let translateValue = 0;

		if (position === 0) translateValue = -40;

		if (position === 1) translateValue = 25;

		translateX.value = withTiming(translateValue, { duration: 100 });
	};

	const animatedTranslateStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		};
	});

	const areFiltersApplied = allBooksFilters.minimumRating !== 0 || allBooksFilters.maxNumberOfPages !== 'all';

	const onAddNewBook = () => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setIsAddNewBookModalVisible(true);
		onBlurActiveInput();
	};

	const onOpenFilterModal = () => {
		setIsFilterVisible(true);
		onBlurActiveInput();
	};

	return (
		<>
			<View className="z-10 mb-4 flex w-full flex-row items-center justify-between">
				<Pressable onPress={onAddNewBook}>
					<Icon name="add-circle" color="#3b82f6" size={24} />
				</Pressable>

				<View className="relative flex flex-1 flex-row items-end justify-center">
					<Pressable className="w-12 items-center" onPress={() => handlePress('all', 0)}>
						<Text className={`pb-2 ${filterTabState === 'all' ? 'font-bold text-blue-500' : ''}`}>All</Text>
					</Pressable>
					<Pressable className="w-20 items-center" onPress={() => handlePress('to-read', 1)}>
						<Text className={`pb-2 ${filterTabState === 'to-read' ? 'font-bold text-blue-500' : ''}`}>To Read</Text>
					</Pressable>
					<Animated.View className="absolute bottom-0 h-[2px] w-16 bg-blue-500" style={animatedTranslateStyle} />
				</View>

				<Pressable className="relative" onPress={onOpenFilterModal}>
					<Icon name="filter" color="gray" size={24} />
					{areFiltersApplied && <View className="absolute right-6 top-0 h-2 w-2 rounded-full bg-red-500" />}
				</Pressable>

				<SearchNewBookModal isVisible={isAddNewBookModalVisible} onClose={onCloseAddNewBookModal} />
			</View>
			<FilterModal type="allBooks" isVisible={isFilterVisible} onClose={() => setIsFilterVisible(false)} />
		</>
	);
};

export default Filterbar;
