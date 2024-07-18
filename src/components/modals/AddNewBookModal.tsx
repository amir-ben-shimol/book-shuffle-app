import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { UIModal } from '@/ui/UIModal';
import type { Book } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';

type Props = {
	readonly isVisible: boolean;
	readonly onClose: VoidFunction;
};

const INITIAL_BOOK_STATE = {
	bookId: 0,
	title: '',
	author: '',
	authorLf: '',
	additionalAuthors: '',
	isbn: '',
	isbn13: '',
	myRating: 0,
	averageRating: 0,
	publisher: '',
	binding: '',
	numberOfPages: undefined,
	yearPublished: 0,
	originalPublicationYear: 0,
	dateRead: '',
	bookshelves: 'to-read',
	bookshelvesWithPositions: '',
	exclusiveShelf: 'to-read',
	myReview: '',
	spoiler: '',
	privateNotes: '',
	readCount: 0,
	ownedCopies: 0,
	bookCoverUrl: '',
};

export const AddNewBookModal = (props: Props) => {
	const { onAddBook } = useBooksStore();
	const [newBook, setNewBook] = useState<Book>(INITIAL_BOOK_STATE);
	const [isFocused, setIsFocused] = useState(false);

	const handleChange = (key: keyof Book, value: string | number) => {
		setNewBook({ ...newBook, [key]: value });
	};

	const handleSubmit = () => {
		props.onClose();
		onAddBook({ ...newBook, bookId: Math.floor(Math.random() * 1000) });
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets[0]) {
			handleChange('bookCoverUrl', result.assets[0].uri);
		}
	};

	const onClose = () => {
		props.onClose();
		setNewBook(INITIAL_BOOK_STATE);
	};

	const onFocused = () => {
		setIsFocused(true);
	};

	const onBlurred = () => {
		setIsFocused(false);
	};

	return (
		<UIModal modalHeaderTitle="Add your new book 😝" size={isFocused ? 'large' : 'small'} isOpen={props.isVisible} onClose={onClose}>
			<View className="w-full p-4">
				<View className="mb-4 flex flex-row justify-between">
					<View className="flex h-[200px] w-[48%] justify-between">
						<TextInput
							value={newBook.title}
							className="mb-4 rounded border border-gray-300 p-2"
							placeholder="Title"
							onFocus={onFocused}
							onBlur={onBlurred}
							onChangeText={(text) => handleChange('title', text)}
						/>

						<TextInput
							value={newBook.author}
							className="mb-4 rounded border border-gray-300 p-2"
							placeholder="Author"
							onFocus={onFocused}
							onBlur={onBlurred}
							onChangeText={(text) => handleChange('author', text)}
						/>

						<TextInput
							value={newBook.numberOfPages?.toString()}
							className="mb-4 rounded border border-gray-300 p-2"
							placeholder="Number of pages"
							keyboardType="numeric"
							onFocus={onFocused}
							onBlur={onBlurred}
							onChangeText={(text) => handleChange('numberOfPages', text)}
						/>
						<TextInput
							value={newBook.spoiler}
							className="rounded border border-gray-300 p-2"
							placeholder="Spoiler"
							onFocus={onFocused}
							onBlur={onBlurred}
							onChangeText={(text) => handleChange('spoiler', text)}
						/>
					</View>

					<TouchableOpacity className="flex w-[48%] items-center justify-center rounded border border-gray-300 p-2" onPress={pickImage}>
						{newBook.bookCoverUrl ? (
							<Image source={{ uri: newBook.bookCoverUrl }} style={{ width: 100, height: 150 }} />
						) : (
							<Text className="text-gray-300">Select a Cover Image</Text>
						)}
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={handleSubmit}>
					<View className="mt-6 flex items-center justify-center rounded-full bg-blue-400 p-2">
						<Text className="text-xl font-semibold text-white">Add Book 📚</Text>
					</View>
				</TouchableOpacity>
			</View>
		</UIModal>
	);
};

export default AddNewBookModal;
