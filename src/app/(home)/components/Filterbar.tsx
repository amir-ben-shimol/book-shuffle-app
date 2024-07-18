import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { FilterTabs } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { AddNewBookModal } from '@/modals/AddNewBookModal';
import { UIFilter } from '@/ui/UIFilter';

type Props = {
	readonly onBlurSearchInput: VoidFunction;
};

const Filterbar = (props: Props) => {
	const { selectedFilterTab, allBooksFilters, setFilterTab } = useBooksStore();
	const [filterTabState, setFilterTabState] = useState<FilterTabs>(selectedFilterTab);
	const [isFilterVisible, setIsFilterVisible] = useState(false);
	const translateX = useSharedValue(selectedFilterTab === 'all' ? -40 : 25);
	const backdropOpacity = useSharedValue(0);
	const filterOpacity = useSharedValue(0);
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

	const onAddNewBook = () => {
		setIsAddNewBookModalVisible(true);
		props.onBlurSearchInput();
	};

	const onToggleFilter = () => {
		if (isFilterVisible) {
			backdropOpacity.value = withTiming(0, { duration: 200 });
			filterOpacity.value = withTiming(0, { duration: 200 });
			setTimeout(() => setIsFilterVisible(false), 200);
		} else {
			setIsFilterVisible(true);
			backdropOpacity.value = withTiming(1, { duration: 200 });
			filterOpacity.value = withTiming(1, { duration: 200 });
		}
	};

	console.log('allBooksFilters', allBooksFilters);

	return (
		<>
			<View className="z-10 mb-4 flex w-full flex-row items-center justify-between">
				<Pressable onPress={onAddNewBook}>
					<Icon name="add" color="gray" size={24} />
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

				<Pressable className="relative" onPress={onToggleFilter}>
					<Icon name="sort" color="gray" size={24} />
				</Pressable>

				{/* {isFilterVisible && (
				<>
					<Animated.View className="absolute z-50 flex-1 bg-black" style={[backdropAnimatedStyle, { zIndex: 9, opacity: 0.5 }]}>
						<TouchableOpacity className="absolute z-50 flex-1 bg-black" onPress={onBackdropPress} />
					</Animated.View>
					<Animated.View className="absolute right-4 top-4 w-[300px] rounded bg-white p-2 shadow-lg" style={[filterAnimatedStyle, { zIndex: 10 }]}>
						<Text>Filter Option 1</Text>
						<Text>Filter Option 2</Text>
						<Text>Filter Option 3</Text>
						<Text>Filter Option 4</Text>
					</Animated.View>
				</>
			)} */}
				<AddNewBookModal isVisible={isAddNewBookModalVisible} onClose={onCloseAddNewBookModal} />
			</View>
			<UIFilter isVisible={isFilterVisible} onClose={() => setIsFilterVisible(false)} />
		</>
	);
};

export default Filterbar;
