/* eslint-disable max-lines */
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import type { Filters, Book } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { onLongHaptics } from '@/lib/utils/haptics';
import { UIRating } from '@/ui/UIRating';
import { BookInfoModal } from '@/modals/BookInfoModal';
import { FilterModal } from '@/modals/FilterModal';
import { splitBookTitleAndSubtitle } from '@/lib/utils/book';
import { getImageDominantColor } from '@/lib/utils/image';

const ShuffleScreen = () => {
	const { booksList } = useBooksStore();
	const [selectedShuffleBook, setSelectedShuffleBook] = useState<Book | undefined>(undefined);
	const [fireConfetti, setFireConfetti] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

	const [filters, setFilters] = useState<Filters>({
		minimumRating: 0,
		maxNumberOfPages: 'all',
	});

	const [bookCoverBackgroundColors, setBookCoverBackgroundColors] = useState<string[]>([]);

	const fetchBookCoverColors = async (bookCoverImage: string) => {
		const colors = await getImageDominantColor(bookCoverImage);

		if (colors.length > 0) {
			setBookCoverBackgroundColors(colors);
		}
	};

	const fadeInSlowOpacity = useSharedValue(0);
	const fadeInTitleOpacity = useSharedValue(0);
	const fadeInAuthorOpacity = useSharedValue(0);
	const fadeInFastOpacity = useSharedValue(0);

	useEffect(() => {
		if (selectedShuffleBook) {
			fadeInTitleOpacity.value = withDelay(1250, withTiming(1, { duration: 500 }));
			fadeInAuthorOpacity.value = withDelay(1750, withTiming(1, { duration: 500 }));
			fadeInFastOpacity.value = withDelay(2000, withTiming(1, { duration: 500 }));
			fadeInSlowOpacity.value = withDelay(4000, withTiming(1, { duration: 500 }));
			setFireConfetti(true);
		}
	}, [selectedShuffleBook, fadeInAuthorOpacity, fadeInFastOpacity, fadeInSlowOpacity, fadeInTitleOpacity]);

	const fadeInSlowStyle = useAnimatedStyle(() => ({
		opacity: fadeInSlowOpacity.value,
	}));

	const fadeInFastStyle = useAnimatedStyle(() => ({
		opacity: fadeInFastOpacity.value,
	}));

	const fadeInTitleStyle = useAnimatedStyle(() => ({
		opacity: fadeInTitleOpacity.value,
	}));

	const fadeInAuthorStyle = useAnimatedStyle(() => ({
		opacity: fadeInAuthorOpacity.value,
	}));

	const areFiltersApplied = filters.minimumRating !== 0 || filters.maxNumberOfPages !== 'all';

	const onShuffle = useCallback(() => {
		setSelectedShuffleBook(undefined);
		setFireConfetti(false);

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		const filteredBooksList = booksList
			.filter((book) => book.bookshelves.includes('to-read'))
			.filter((book) => {
				if (filters.minimumRating === 0) {
					return true;
				}

				return book.averageRating >= filters.minimumRating;
			})
			.filter((book) => {
				const numberOfPages = book.numberOfPages;

				if (numberOfPages === undefined) {
					return true;
				}

				const maxNumberOfPages = parseInt(filters.maxNumberOfPages, 10);

				if (maxNumberOfPages === 0) {
					return true;
				}

				switch (filters.maxNumberOfPages) {
					case 'all': {
						return true;
					}
					case 'up-to-200': {
						return numberOfPages <= 200 && numberOfPages > 0;
					}
					case '200-400': {
						return numberOfPages <= 400 && numberOfPages > 200;
					}
					case '400-500': {
						return numberOfPages <= 500 && numberOfPages > 400;
					}
					case '500-600': {
						return numberOfPages <= 600 && numberOfPages > 500;
					}
					case '600-800': {
						return numberOfPages <= 800 && numberOfPages > 600;
					}
					case '800+': {
						return numberOfPages >= 800;
					}
					default: {
						return true;
					}
				}
			});

		const randomIndex = Math.floor(Math.random() * filteredBooksList.length);

		if (filteredBooksList[randomIndex]) {
			setSelectedShuffleBook(filteredBooksList[randomIndex]);
		}
	}, [booksList, filters]);

	const onResetShuffle = useCallback(() => {
		setSelectedShuffleBook(undefined);
		setFireConfetti(false);

		fadeInSlowOpacity.value = 0;
		fadeInFastOpacity.value = 0;
		fadeInTitleOpacity.value = 0;
		fadeInAuthorOpacity.value = 0;
	}, [fadeInSlowOpacity, fadeInFastOpacity, fadeInTitleOpacity, fadeInAuthorOpacity, filters]);

	const onApplyFilters = useCallback((filters: Filters) => {
		setFilters(filters);
	}, []);

	const onResetFilters = () => {
		setFilters({
			minimumRating: 0,
			maxNumberOfPages: 'all',
		});
	};

	const onViewBookDetails = () => {
		if (selectedShuffleBook?.bookCoverUrl) {
			fetchBookCoverColors(selectedShuffleBook.bookCoverUrl);
		}

		setIsModalOpen(true);
	};

	return (
		<View className={`relative -mx-4 flex h-full flex-1 items-center bg-slate-100 ${selectedShuffleBook ? 'justify-start' : 'justify-center'}`}>
			{selectedShuffleBook ? (
				<>
					<View className="mt-6 flex items-center justify-center">
						{selectedShuffleBook.title && splitBookTitleAndSubtitle(selectedShuffleBook.title).title && (
							<Animated.Text className="text-center text-4xl font-bold text-blue-500" style={fadeInTitleStyle}>
								{splitBookTitleAndSubtitle(selectedShuffleBook.title).title}
							</Animated.Text>
						)}
						{selectedShuffleBook.title && splitBookTitleAndSubtitle(selectedShuffleBook?.title).subTitle && (
							<Animated.Text className="text-center text-xl font-semibold text-gray-500" style={fadeInTitleStyle}>
								{`(${splitBookTitleAndSubtitle(selectedShuffleBook?.title).subTitle})`}
							</Animated.Text>
						)}
						<Animated.Text className="mb-4 text-xl font-semibold text-gray-600" style={fadeInAuthorStyle}>
							{`by ${selectedShuffleBook.author}`}
						</Animated.Text>
					</View>
					<Animated.Image
						source={{ uri: selectedShuffleBook.bookCoverUrl }}
						style={fadeInFastStyle}
						className="h-[320px] w-[250px] rounded"
						resizeMode="contain"
					/>
					{fireConfetti && <ConfettiCannon count={500} origin={{ x: -10, y: 0 }} fallSpeed={2000} />}
					<Animated.View style={fadeInFastStyle} className="flex items-center justify-center">
						<UIRating
							className="my-2 bg-slate-100"
							imageSize={45}
							showRating
							tintColor="#f1f5f9"
							rating={selectedShuffleBook?.averageRating ?? 0}
						/>
						<ThemedButton
							name="bruce"
							type="messenger"
							progressLoadingTime={0}
							backgroundColor="#60a5fa"
							activityColor="#fff"
							borderColor="#60a5fa"
							size="small"
							textSize={14}
							onPress={onViewBookDetails}
						>
							View details
						</ThemedButton>
					</Animated.View>

					<Animated.View style={[fadeInSlowStyle]} className="mb-4 mr-4 mt-auto flex flex-row items-center self-end">
						<TouchableOpacity className="ml-2 rounded-full bg-gray-400 p-2" onPress={onResetShuffle}>
							<Icon name="redo" color="white" size={14} />
						</TouchableOpacity>
					</Animated.View>

					<BookInfoModal
						book={selectedShuffleBook}
						bookCoverBackgroundColors={bookCoverBackgroundColors}
						isVisible={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>
				</>
			) : (
				<>
					<Pressable className="absolute right-4 top-4" onPress={() => setIsFilterVisible(true)}>
						<Icon name="sort" color="gray" size={24} />
						{areFiltersApplied && (
							<View className="absolute right-6 top-0">
								<Icon name="circle" color="red" size={12} />
							</View>
						)}
					</Pressable>

					<ThemedButton
						progress
						name="bruce"
						type="messenger"
						size="large"
						backgroundColor="#60a5fa"
						activityColor="#fff"
						borderColor="#60a5fa"
						textSize={30}
						progressLoadingTime={4000}
						onPress={async () => {
							onLongHaptics();

							await new Promise((resolve) => {
								setTimeout(resolve, 2500);
								Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
							});
							onShuffle();
						}}
					>
						Find my book!
					</ThemedButton>
				</>
			)}

			<FilterModal
				type="shuffle"
				filters={filters}
				isVisible={isFilterVisible}
				onClose={() => setIsFilterVisible(false)}
				onApplyFilters={onApplyFilters}
				onResetFilters={onResetFilters}
			/>
		</View>
	);
};

export default React.memo(ShuffleScreen);
