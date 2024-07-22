import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Text, FlatList, TouchableOpacity, Image, Pressable, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { Book } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { getImageDominantColor } from '@/lib/utils/image';
import { BookInfoModal } from '@/modals/BookInfoModal';

const RecentlyViewedBooks = () => {
	const { recentlyViewedBooks, onResetRecentlyViewedBooks } = useBooksStore();
	const translateY = useSharedValue(100);
	const opacity = useSharedValue(0);

	const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
	const [isBookInfoModalVisible, setIsBookInfoModalVisible] = useState(false);
	const [bookCoverBackgroundColors, setBookCoverBackgroundColors] = useState<string[]>(['#1e293b', '#404040']);

	useEffect(() => {
		translateY.value = withTiming(0, { duration: 500 });
		opacity.value = withTiming(1, { duration: 500 });

		return () => {
			translateY.value = withTiming(100, { duration: 500 });
			opacity.value = withTiming(0, { duration: 500 });
		};
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
			opacity: opacity.value,
		};
	});

	const fetchBookCoverColors = async (bookCoverImage: string) => {
		const colors = await getImageDominantColor(bookCoverImage);

		if (colors.length > 0) {
			setBookCoverBackgroundColors(colors);
		}
	};

	const handleBookSelect = async (book: Book) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		setSelectedBook(book);

		if (book.bookCoverUrl) {
			await fetchBookCoverColors(book.bookCoverUrl);
		}

		setIsBookInfoModalVisible(true);
	};

	const groupIntoRows = (data: Book[], itemsPerRow: number) => {
		const rows = [];

		for (let i = 0; i < data.length; i += itemsPerRow) {
			rows.push(data.slice(i, i + itemsPerRow));
		}

		return rows;
	};

	const rows = groupIntoRows(recentlyViewedBooks, 2);

	const renderItem = ({ item }: { item: Book[] }) => (
		<View style={{ flexDirection: 'column', marginRight: 8 }}>
			{item.map((book) => (
				<TouchableOpacity key={book.bookId.toString()} style={{ marginBottom: 8 }} onPress={() => handleBookSelect(book)}>
					<Image source={{ uri: book.bookCoverUrl }} style={{ height: 144, width: 96 }} />
				</TouchableOpacity>
			))}
		</View>
	);

	return (
		<Animated.View style={[animatedStyle, { flex: 1 }]}>
			<View className="mb-4 flex flex-row items-center justify-between border-b border-gray-200 pb-4">
				<Text className="text-l font-semibold">Recently Viewed Books</Text>
				<Pressable onPress={onResetRecentlyViewedBooks}>
					<Text className="font-bold text-blue-400">Clear</Text>
				</Pressable>
			</View>
			{recentlyViewedBooks.length === 0 && <Text className="border-4 text-center text-gray-500">No books viewed yet</Text>}
			{recentlyViewedBooks.length <= 4 ? (
				<FlatList
					data={recentlyViewedBooks}
					keyExtractor={(item) => item.bookId.toString()}
					className="w-full"
					horizontal
					renderItem={({ item }) => (
						<TouchableOpacity className="mb-4 flex flex-row items-start" onPress={() => handleBookSelect(item)}>
							<Image source={{ uri: item.bookCoverUrl }} className="mr-2 h-36 w-24" />
						</TouchableOpacity>
					)}
				/>
			) : (
				<FlatList data={rows} keyExtractor={(_, index) => index.toString()} horizontal renderItem={renderItem} showsHorizontalScrollIndicator={false} />
			)}
			<BookInfoModal
				book={selectedBook}
				isVisible={isBookInfoModalVisible}
				bookCoverBackgroundColors={bookCoverBackgroundColors}
				onClose={() => setIsBookInfoModalVisible(false)}
			/>
		</Animated.View>
	);
};

export default RecentlyViewedBooks;
