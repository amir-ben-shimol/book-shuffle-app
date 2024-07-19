import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { UIModal } from '@/ui/UIModal';
import type { Book } from '@/lib/types/ui/book';
import { UIInput } from '@/ui/UIInput';
import { useBook } from '@/lib/hooks/useBooks';
// import { UIRating } from '@/ui/UIRating';
import { BookInfoModal } from './BookInfoModal';

type Props = {
	readonly isVisible: boolean;
	readonly onClose: VoidFunction;
};

export const SearchNewBookModal = (props: Props) => {
	const { searchBooks } = useBook();
	const [query, setQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<Book[]>([]);
	const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
	const [isBookInfoModalVisible, setIsBookInfoModalVisible] = useState(false);

	const onFetchBooks = async (query: string) => {
		try {
			setIsLoading(true);
			const searchResults = await searchBooks(query);

			setResults(searchResults);
		} finally {
			setIsLoading(false);
		}
	};

	const onClose = () => {
		props.onClose();
		setQuery('');
		setResults([]);
	};

	const handleBookSelect = (book: Book) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		setSelectedBook(book);
		setIsBookInfoModalVisible(true);
	};

	return (
		<>
			<UIModal scrollable={false} modalHeaderTitle="Search your new book 😝" size="large" isOpen={props.isVisible} onClose={onClose}>
				<View className="w-full">
					<UIInput placeholder="Title or Author" value={query} autoFocus debounceDelay={1000} debounceCallback={onFetchBooks} />
					{results.length > 0 ? (
						<FlatList
							data={results}
							keyExtractor={(item) => item.bookId.toString()}
							className="w-full"
							renderItem={({ item }) => (
								<TouchableOpacity className="mb-4 flex flex-row items-start" onPress={() => handleBookSelect(item)}>
									<Image source={{ uri: item.bookCoverUrl }} className="mr-4 h-36 w-24" />
									<View className="flex flex-1">
										<Text className="-mt-1 text-lg font-bold">{item.title}</Text>
										<Text className="text-sm text-gray-600">{item.author}</Text>
										{/* <View className="flex flex-row items-center">
											<Text className="text-sm text-gray-600">Rating</Text>
											<UIRating imageSize={15} rating={item.averageRating} />
										</View> */}
										<Text className="text-sm text-gray-600">{`Year: ${item.yearPublished}`}</Text>
									</View>
								</TouchableOpacity>
							)}
						/>
					) : (
						<View className="flex h-3/5 items-center justify-center">
							{results.length === 0 && !isLoading ? (
								<Text className="text-center text-lg text-gray-600">No results found</Text>
							) : isLoading ? (
								<Image source={require('@/assets/gifs/book-loader.gif')} className="h-48 w-48" />
							) : null}
						</View>
					)}
				</View>
			</UIModal>
			<BookInfoModal
				book={selectedBook}
				canAdd
				isVisible={isBookInfoModalVisible}
				onSuccessfulAdd={onClose}
				onClose={() => setIsBookInfoModalVisible(false)}
			/>
		</>
	);
};
