import { View, Text, Image } from 'react-native';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { UIModal } from '@/ui/UIModal';

type Props = {
	readonly isVisible: boolean;
	readonly onClose: VoidFunction;
};

export const BookInfoModal = (props: Props) => {
	const { selectedBook, setSelectedBook } = useBooksStore();

	const onClose = () => {
		props.onClose();
		setSelectedBook(null);
	};

	return (
		<UIModal isOpen={props.isVisible} modalHeaderTitle={selectedBook?.title ?? ''} size="extraSmall" onClose={onClose}>
			<View className="flex w-full flex-row items-start justify-between p-4">
				<View className="flex items-start justify-center">
					<View className="mb-2 flex flex-row items-center">
						<Text className="text-lg font-semibold text-gray-600">Author: </Text>
						<Text className="text-lg text-gray-600">{selectedBook?.author}</Text>
					</View>
					<View className="mb-2 flex flex-row items-center">
						<Text className="text-lg font-semibold text-gray-600">Publisher: </Text>
						<Text className="text-lg text-gray-600">{selectedBook?.publisher}</Text>
					</View>
					<View className="mb-2 flex flex-row items-center">
						<Text className="text-lg font-semibold text-gray-600">Year published: </Text>
						<Text className="text-lg text-gray-600">{selectedBook?.yearPublished}</Text>
					</View>
					<View className="flex flex-row items-center">
						<Text className="text-lg font-semibold text-gray-600">Number of pages: </Text>
						<Text className="text-lg text-gray-600">{selectedBook?.numberOfPages}</Text>
					</View>
				</View>
				<Image source={{ uri: selectedBook?.bookCoverUrl }} className="h-[170px] w-[110px] shadow-lg" resizeMode="cover" />
			</View>
		</UIModal>
	);
};
