import React, { useState, useDeferredValue, useMemo, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Book } from '@/lib/types/ui/book';
import { BookInfoModal } from '@/modals/BookInfoModal';
import { getImageDominantColor } from '@/lib/utils/image';
import { onBlurActiveInput } from '@/lib/utils/input';
import { UIBookCover } from '@/ui/UIBookCover';
import { useBooksStore } from '@/lib/store/useBooksStore';
import Searchbar from './components/Searchbar';
import Filterbar from './components/Filterbar';
import RecentlyViewedBooks from './components/RecentlyViewedBooks';

const HomeScreen = () => {
	const { booksList, filterBooksQuery, selectedFilterTab, allBooksFilters, onAddRecentlyViewedBook } = useBooksStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
	const [isSearchInputActive, setIsSearchInputActive] = useState(false);
	const [bookCoverBackgroundColors, setBookCoverBackgroundColors] = useState<string[]>(['#1e293b', '#404040']);

	const fetchBookCoverColors = async (bookCoverImage: string) => {
		const colors = await getImageDominantColor(bookCoverImage);

		if (colors.length > 0) {
			setBookCoverBackgroundColors(colors);
		}
	};

	const test: any = 1;

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

	const onBookClick = useCallback(async (book: Book) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setSelectedBook(book);

		if (book.bookCoverUrl) {
			await fetchBookCoverColors(book.bookCoverUrl);
		}

		onAddRecentlyViewedBook(book);
		setIsModalOpen(true);
	}, []);

	const renderBook = useCallback(
		({ item }: { item: Book }) => <UIBookCover className="relative mb-4 w-[31%] overflow-hidden" book={item} onPress={onBookClick} />,
		[],
	);

	const onUpdateBook = (book: Book) => {
		setSelectedBook(book);
	};

	const onActivateSearchInput = () => setIsSearchInputActive(true);

	const onDeactivateSearchInput = () => setIsSearchInputActive(false);

	return (
		<View className="flex flex-1">
			<Searchbar isActive={isSearchInputActive} onActivate={onActivateSearchInput} onDeactivate={onDeactivateSearchInput} />
			{isSearchInputActive && filterBooksQuery.length === 0 ? (
				<RecentlyViewedBooks />
			) : (
				<>
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
				</>
			)}
			<BookInfoModal
				book={selectedBook}
				isVisible={isModalOpen}
				bookCoverBackgroundColors={bookCoverBackgroundColors}
				onUpdateBook={onUpdateBook}
				onClose={() => setIsModalOpen(false)}
			/>
		</View>
	);
};

export default React.memo(HomeScreen);
