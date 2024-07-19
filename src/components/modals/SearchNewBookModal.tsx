import React, { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
	const [isFocused, setIsFocused] = useState(false);
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
		[searchBooks],
	);

	const handleClear = () => {
		setQuery('');
		setResults([]);
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

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
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		setSelectedBook(book);
		setIsBookInfoModalVisible(true);
	};

	return (
		<>
			<UIModal scrollable={false} modalHeaderTitle="Search your new book 😝" size="large" isOpen={props.isVisible} onClose={onClose}>
				<View className="w-full">
					<View
						className={`mb-4 flex flex-row items-center rounded border bg-gray-200 px-2 py-2 ${isFocused ? 'border-blue-500' : 'border-gray-200'}`}
					>
						<Icon name="search" color="gray" size={24} />
						<TextInput
							placeholder="Title or Author"
							className="ml-2 flex-1 text-start"
							value={query}
							autoFocus
							onChangeText={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
						/>
						{query.length > 0 && (
							<Pressable onPress={handleClear}>
								<Icon name="cancel" color="gray" size={18} />
							</Pressable>
						)}
					</View>
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
						<View className="flex h-3/5 items-center justify-center">
							{query.length === 0 ? (
								<Text className="text-center text-lg text-gray-600">No results found</Text>
							) : (
								<Image source={require('@/assets/gifs/book-loader.gif')} className="h-48 w-48" />
							)}
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
