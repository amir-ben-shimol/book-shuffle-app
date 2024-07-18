import React, { useState, useDeferredValue, useMemo, useRef } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import type { Book } from '@/lib/types/ui/book';
import { BookInfoModal } from '@/modals/BookInfoModal';
import { useBooksStore } from '@/lib/store/useBooksStore';
import Searchbar, { type SearchbarHandle } from './components/Searchbar';
import Filterbar from './components/Filterbar';

const HomeScreen = () => {
	const { booksList, filterBooksQuery, selectedFilterTab, setSelectedBook } = useBooksStore();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const deferredQuery = useDeferredValue(filterBooksQuery);
	const searchbarRef = useRef<SearchbarHandle>(null);

	const filteredBooksList = useMemo(() => {
		return booksList
			.filter((book) => book.title.toLowerCase().includes(deferredQuery.toLowerCase()))
			.filter((book) => (selectedFilterTab === 'to-read' ? book.bookshelves.includes('to-read') || book.exclusiveShelf.includes('to-read') : true));
	}, [booksList, deferredQuery, selectedFilterTab]);

	const onBookClick = (book: Book) => {
		setIsModalOpen(true);
		setSelectedBook(book);
	};

	const renderBook = ({ item }: { item: Book }) => {
		return (
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
		);
	};

	const onBlurSearchInput = () => {
		searchbarRef.current?.blurInput();
	};

	return (
		<View className="flex flex-1 items-center justify-center">
			<Searchbar ref={searchbarRef} />
			<Filterbar onBlurSearchInput={onBlurSearchInput} />
			<FlatList
				// key={key}
				data={filteredBooksList}
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				className="w-full"
				scrollEventThrottle={16}
				renderItem={renderBook}
				keyExtractor={(item) => item.bookId.toString()}
				numColumns={3}
				onScroll={onBlurSearchInput}
			/>
			<BookInfoModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</View>
	);
};

export default React.memo(HomeScreen);
