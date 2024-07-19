import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { UIModal } from '@/ui/UIModal';
import type { Book } from '@/lib/types/ui/book';
import { debounce } from '@/lib/utils/debounce';
import { useBook } from '@/lib/hooks/useBooks';
import { UIRating } from '@/ui/UIRating';
import { BookInfoModal } from './BookInfoModal';

type Props = {
	readonly isVisible: boolean;
	readonly onClose: VoidFunction;
};

export const SearchNewBookModal = (props: Props) => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<Book[]>([]);
	const { searchBooks } = useBook();
	const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
	const [isBookInfoModalVisible, setIsBookInfoModalVisible] = useState(false);

	const debouncedSearchBooks = useCallback(
		debounce(async (query: string) => {
			if (query) {
				const searchResults = await searchBooks(query);

				setResults(searchResults);
			} else {
				setResults([]);
			}
		}, 500),
		[],
	);

	const handleChange = (text: string) => {
		setQuery(text);
		debouncedSearchBooks(text);
	};

	const onClose = () => {
		props.onClose();
		setQuery('');
		setResults([]);
	};

	const handleBookSelect = (book: Book) => {
		setSelectedBook(book);
		setIsBookInfoModalVisible(true);
	};

	return (
		<>
			<UIModal scrollable={false} modalHeaderTitle="Search your new book 😝" size="large" isOpen={props.isVisible} onClose={onClose}>
				<View className="w-full">
					<TextInput value={query} className="mb-4 rounded border border-gray-300 p-2" placeholder="Title or Author" onChangeText={handleChange} />
					{results.length > 0 ? (
						<FlatList
							data={results}
							keyExtractor={(item) => item.bookId.toString()}
							className="w-full pb-4"
							renderItem={({ item }) => (
								<TouchableOpacity className="mb-4 flex flex-row items-center" onPress={() => handleBookSelect(item)}>
									<Image source={{ uri: item.bookCoverUrl }} className="mr-4 h-20 w-14" />
									<View>
										<Text className="text-lg font-bold">{item.title}</Text>
										<Text className="text-sm text-gray-600">{item.author}</Text>
										<View className="flex flex-row items-center">
											<Text className="text-sm text-gray-600">Rating</Text>
											<UIRating imageSize={15} rating={item.averageRating} />
										</View>
										<Text className="text-sm text-gray-600">{`Year: ${item.yearPublished}`}</Text>
									</View>
								</TouchableOpacity>
							)}
						/>
					) : (
						<View className="flex h-4/5 items-center justify-center">
							{query.length === 0 ? (
								<Text className="text-center text-lg text-gray-600">No results found</Text>
							) : (
								<Image source={require('@/assets/gifs/book-loader.gif')} className="h-48 w-48" />
							)}
						</View>
					)}
				</View>
			</UIModal>
			<BookInfoModal book={selectedBook} canAdd isVisible={isBookInfoModalVisible} onClose={() => setIsBookInfoModalVisible(false)} />
		</>
	);
};
