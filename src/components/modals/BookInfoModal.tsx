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
		<UIModal isOpen={props.isVisible} modalHeaderTitle={selectedBook?.title ?? ''} onClose={onClose}>
			<View className="flex w-full flex-row items-start justify-between p-4">
				<View className="flex items-center justify-center">
					<Text>{selectedBook?.author}</Text>
					<Text>{selectedBook?.publisher}</Text>
					<Text>{selectedBook?.yearPublished}</Text>
					<Text>{selectedBook?.author}</Text>
				</View>
				<Image source={{ uri: selectedBook?.bookCoverUrl }} className="h-[170px] w-[110px]" />
			</View>
		</UIModal>
	);
};
