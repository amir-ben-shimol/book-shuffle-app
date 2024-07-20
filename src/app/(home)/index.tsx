import React, { useState, useDeferredValue, useMemo, useCallback } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Book } from '@/lib/types/ui/book';
import { BookInfoModal } from '@/modals/BookInfoModal';
import { onBlurActiveInput } from '@/lib/utils/input';
import { useBooksStore } from '@/lib/store/useBooksStore';
import Searchbar from './components/Searchbar';
import Filterbar from './components/Filterbar';

const HomeScreen = () => {
	const { booksList, filterBooksQuery, selectedFilterTab, allBooksFilters } = useBooksStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

	const deferredQuery = useDeferredValue(filterBooksQuery);

	const filteredBooksList = useMemo(() => {
		return booksList
			.filter((book) => book.title.toLowerCase().includes(deferredQuery.toLowerCase()))
			.filter((book) => (selectedFilterTab === 'to-read' ? book.bookshelves.includes('to-read') || book.exclusiveShelf.includes('to-read') : true))
			.filter((book) => {
				const numberOfPages = book.numberOfPages;

				if (numberOfPages === undefined) {
					return true;
				}

				const maxNumberOfPages = parseInt(allBooksFilters.maxNumberOfPages, 10);

				if (maxNumberOfPages === 0) {
					return true;
				}

				switch (allBooksFilters.maxNumberOfPages) {
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
			})
			.filter((book) => {
				if (allBooksFilters.minimumRating === 0) {
					return true;
				}

				return book.averageRating >= allBooksFilters.minimumRating;
			});
	}, [booksList, deferredQuery, selectedFilterTab, allBooksFilters]);

	const onBookClick = useCallback((book: Book) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setIsModalOpen(true);
		setSelectedBook(book);
	}, []);

	const BookItem = React.memo(({ item }: { item: Book }) => (
		<TouchableOpacity
			key={item.bookId}
			className="relative mb-4 w-[31%] overflow-hidden"
			onPress={() => {
				onBookClick(item);
			}}
		>
			<View className="flex overflow-hidden rounded shadow-lg">
				{item.bookCoverUrl && <Image source={{ uri: item.bookCoverUrl }} className="h-[170px] w-full" resizeMode="cover" />}
			</View>
			{!item.bookshelves.includes('to-read') && (
				<Text className="absolute -left-6 top-4 w-24 -rotate-45 bg-green-700 px-5 text-center text-white">Read</Text>
			)}
		</TouchableOpacity>
	));

	const renderBook = useCallback(({ item }: { item: Book }) => <BookItem item={item} />, []);

	const onUpdateBook = (book: Book) => {
		setSelectedBook(book);
	};

	return (
		<View className="flex flex-1">
			<Searchbar />
			<Filterbar />
			<FlatList
				data={filteredBooksList}
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				className="h-full w-full"
				scrollEventThrottle={16}
				renderItem={renderBook}
				keyExtractor={(item) => item.bookId.toString()}
				numColumns={3}
				initialNumToRender={12}
				maxToRenderPerBatch={12}
				windowSize={21}
				updateCellsBatchingPeriod={50}
				removeClippedSubviews
				onTouchStart={onBlurActiveInput}
			/>
			<BookInfoModal book={selectedBook} isVisible={isModalOpen} onUpdateBook={onUpdateBook} onClose={() => setIsModalOpen(false)} />
		</View>
	);
};

export default React.memo(HomeScreen);
