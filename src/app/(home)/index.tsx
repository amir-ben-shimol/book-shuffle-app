import { useState } from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';
import type { Book } from '@/lib/types/ui/book';
import { UIModal } from '@/ui/UIModal';
import { useBooksStore } from '@/lib/store/useBooksStore';

const HomeScreen = () => {
	const { booksList } = useBooksStore();
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const onBookClick = (book: Book) => {
		setIsModalOpen(true);
		setSelectedBook(book);
	};

	return (
		<View className="flex flex-1 items-center justify-center">
			<ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
				{booksList.map((book) => (
					<TouchableOpacity key={book.bookId} className="m2 mb-5 w-1/3" onPress={() => onBookClick(book)}>
						<View className="flex items-center justify-center rounded shadow-lg">
							{book.bookCoverUrl && <Image source={{ uri: book.bookCoverUrl }} style={{ width: 110, height: 170 }} />}
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
			<UIModal isOpen={isModalOpen} modalHeaderTitle={selectedBook?.title ?? ''} onClose={() => setIsModalOpen(false)}>
				<View className="flex w-full flex-row items-start justify-between p-4">
					<View className="flex items-center justify-center">
						<Text>{selectedBook?.author}</Text>
						<Text>{selectedBook?.publisher}</Text>
						<Text>{selectedBook?.yearPublished}</Text>
						<Text>{selectedBook?.author}</Text>
					</View>
					<Image source={{ uri: selectedBook?.bookCoverUrl }} style={{ width: 110, height: 170 }} />
				</View>
			</UIModal>
		</View>
	);
};

export default HomeScreen;
