import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import type { Book } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { onLongHaptics } from '@/lib/utils/haptics';

const ShuffleScreen = () => {
	const { booksList } = useBooksStore();
	const [selectedShuffleBook, setSelectedShuffleBook] = useState<Book | undefined>(undefined);
	const [fireConfetti, setFireConfetti] = useState(false);

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

	const onShuffle = useCallback(() => {
		setSelectedShuffleBook(undefined);
		setFireConfetti(false);

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		const filteredBooksList = booksList.filter((book) => book.bookshelves.includes('to-read'));

		const randomIndex = Math.floor(Math.random() * filteredBooksList.length);

		if (filteredBooksList[randomIndex]) {
			setSelectedShuffleBook(filteredBooksList[randomIndex]);
		}
	}, [booksList]);

	const onResetShuffle = useCallback(() => {
		setSelectedShuffleBook(undefined);
		fadeInSlowOpacity.value = 0;
		fadeInFastOpacity.value = 0;
		fadeInTitleOpacity.value = 0;
		fadeInAuthorOpacity.value = 0;
	}, [fadeInSlowOpacity, fadeInFastOpacity, fadeInTitleOpacity, fadeInAuthorOpacity]);

	return (
		<View className={`relative -mx-4 flex h-full flex-1 items-center bg-slate-100 ${selectedShuffleBook ? 'justify-start' : 'justify-center'}`}>
			{selectedShuffleBook ? (
				<>
					<View className="mt-10 flex items-center justify-center">
						<Animated.Text className="mb-4 text-lg font-medium text-gray-600" style={fadeInTitleStyle}>
							Your book is ready! 🎉
						</Animated.Text>
						<Animated.Text className="text-center text-4xl font-bold text-gray-600" style={fadeInTitleStyle}>
							{selectedShuffleBook.title}
						</Animated.Text>
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
					<Animated.View style={[{ position: 'absolute', bottom: 30, alignItems: 'center' }, fadeInSlowStyle]}>
						<Text className="mb-2 text-lg font-medium text-gray-600">Not happy with the choice? 😫</Text>
						<ThemedButton name="bruce" backgroundColor="#d1d5db" size="icon" textSize={16} progressLoadingTime={7500} onPress={onResetShuffle}>
							<Icon name="redo" color="white" size={18} />
						</ThemedButton>
					</Animated.View>
				</>
			) : (
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
			)}
		</View>
	);
};

export default React.memo(ShuffleScreen);
