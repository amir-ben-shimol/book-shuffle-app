import React, { useState, useDeferredValue, useMemo, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Book } from '@/lib/types/ui/book';
import { BookInfoModal } from '@/modals/BookInfoModal';
import { useBooksStore } from '@/lib/store/useBooksStore';
import Searchbar, { type SearchbarHandle } from './components/Searchbar';
import Filterbar from './components/Filterbar';

const HomeScreen = () => {
	const { booksList, filterBooksQuery, selectedFilterTab, allBooksFilters } = useBooksStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

	const deferredQuery = useDeferredValue(filterBooksQuery);
	const searchbarRef = useRef<SearchbarHandle>(null);

	const filteredBooksList = useMemo(() => {
		return booksList
			.filter((book) => book.title.toLowerCase().includes(deferredQuery.toLowerCase()))
			.filter((book) => (selectedFilterTab === 'to-read' ? book.bookshelves.includes('to-read') || book.exclusiveShelf.includes('to-read') : true))
			.filter((book) => {
				const yearPublished = book.yearPublished || 0;
				const averageRating = book.averageRating || 0;

				return (
					yearPublished >= +allBooksFilters.yearStart && yearPublished <= +allBooksFilters.yearEnd && averageRating >= allBooksFilters.minimumRating
				);
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
				onBlurSearchInput();
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

	const onBlurSearchInput = useCallback(() => {
		searchbarRef.current?.blurInput();
	}, []);

	return (
		<View className="flex flex-1 items-center justify-center">
			<Searchbar ref={searchbarRef} />
			<Filterbar onBlurSearchInput={onBlurSearchInput} />
			<FlatList
				data={filteredBooksList}
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				className="w-full"
				scrollEventThrottle={16}
				renderItem={renderBook}
				keyExtractor={(item) => item.bookId.toString()}
				numColumns={3}
				initialNumToRender={12}
				maxToRenderPerBatch={12}
				windowSize={21}
				updateCellsBatchingPeriod={50}
				removeClippedSubviews
				onScroll={onBlurSearchInput}
			/>
			<BookInfoModal book={selectedBook} isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</View>
	);
};

export default React.memo(HomeScreen);
