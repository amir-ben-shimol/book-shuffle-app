import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { UIModal } from '@/ui/UIModal';
import { UIRating } from '@/ui/UIRating';
import { useBook } from '@/lib/hooks/useBooks';
import type { Book } from '@/lib/types/ui/book';

type Props = {
	readonly book?: Book;
	readonly isVisible: boolean;
	readonly onClose: VoidFunction;
};

export const BookInfoModal = (props: Props) => {
	const { getBookDescription } = useBook();
	const [bookDescription, setBookDescription] = useState<string | undefined>(undefined);

	const onClose = () => {
		props.onClose();
	};

	useEffect(() => {
		if (!props.book) return;

		getBookDescription(props.book.bookId).then((description) => {
			setBookDescription(description);
		});
	}, [props.book]);

	return (
		<UIModal isOpen={props.isVisible} modalHeaderTitle={props.book?.title ?? ''} size="smallToBig" onClose={onClose}>
			<View className="flex w-full flex-row items-start justify-between p-4">
				<View className="flex w-2/3 items-start justify-center">
					<View className="mb-2 flex flex-row flex-wrap items-center">
						<Text className="text-lg font-semibold text-gray-600">Author: </Text>
						<Text className="flex-shrink text-lg text-gray-600">{props.book?.author}</Text>
					</View>
					<View className="mb-2 flex flex-row flex-wrap items-center">
						<Text className="text-lg font-semibold text-gray-600">Publisher: </Text>
						<Text className="flex-shrink text-lg text-gray-600">{props.book?.publisher}</Text>
					</View>
					<View className="mb-2 flex flex-row flex-wrap items-center">
						<Text className="text-lg font-semibold text-gray-600">Year published: </Text>
						<Text className="flex-shrink text-lg text-gray-600">{props.book?.yearPublished}</Text>
					</View>
					<View className="mb-2 flex flex-row flex-wrap items-center">
						<Text className="text-lg font-semibold text-gray-600">Number of pages: </Text>
						<Text className="flex-shrink text-lg text-gray-600">{props.book?.numberOfPages}</Text>
					</View>
				</View>
				<Image source={{ uri: props.book?.bookCoverUrl }} className="h-[170px] w-[110px] shadow-lg" resizeMode="cover" />
			</View>
			{bookDescription && (
				<View className="px-4 pb-4">
					<Text className="text-lg font-semibold text-gray-600">Book reviews:</Text>
					<UIRating rating={props.book?.averageRating ?? 0} readonly />

					<RenderHtml contentWidth={100} source={{ html: bookDescription }} />
				</View>
			)}
		</UIModal>
	);
};
