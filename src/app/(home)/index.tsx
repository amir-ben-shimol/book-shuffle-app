import { useCallback, useState, useDeferredValue, useMemo } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Book } from '@/lib/types/ui/book';
import { BookInfoModal } from '@/modals/BookInfoModal';
import { useBooksStore } from '@/lib/store/useBooksStore';
import Searchbar from './components/Searchbar';
import Filterbar from './components/Filterbar';

const HomeScreen = () => {
	const { booksList, filterBooksQuery, selectedFilterTab, setSelectedBook } = useBooksStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [key, setKey] = useState(0);
	const deferredQuery = useDeferredValue(filterBooksQuery);

	const filteredBooksList = useMemo(() => {
		return booksList
			.filter((book) => book.title.toLowerCase().includes(deferredQuery.toLowerCase()))
			.filter((book) => (selectedFilterTab === 'to-read' ? book.bookshelves.includes('to-read') || book.exclusiveShelf.includes('to-read') : true))
			.slice(0, 30);
	}, [booksList, deferredQuery, selectedFilterTab]);

	const onBookClick = (book: Book) => {
		setIsModalOpen(true);
		setSelectedBook(book);
	};

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

		setTimeout(() => setKey((prevKey) => prevKey + 1), 2100); // To force the FlatList to re-render, settimeout to let the refresh control finish
	}, []);

	const renderBook = ({ item }: { item: Book }) => {
		return (
			<TouchableOpacity key={item.bookId} className="relative mb-4 w-[31%] overflow-hidden" onPress={() => onBookClick(item)}>
				<View className="flex overflow-hidden rounded shadow-lg">
					{item.bookCoverUrl && <Image source={{ uri: item.bookCoverUrl }} className="h-[170px] w-full" resizeMode="cover" />}
				</View>
				{!item.bookshelves.includes('to-read') && (
					<Text className="absolute -left-6 top-4 w-24 -rotate-45 bg-green-700 px-5 text-center text-white">Read</Text>
				)}
			</TouchableOpacity>
		);
	};

	return (
		<View className="flex flex-1 items-center justify-center">
			<Searchbar />
			<Filterbar />
			<FlatList
				key={key}
				data={filteredBooksList}
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				className="w-full"
				refreshControl={<RefreshControl refreshing={refreshing} tintColor="#cc4d80" progressViewOffset={0} onRefresh={handleRefresh} />}
				scrollEventThrottle={16}
				renderItem={renderBook}
				keyExtractor={(item) => item.bookId.toString()}
				numColumns={3}
			/>
			<BookInfoModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</View>
	);
};

export default HomeScreen;
