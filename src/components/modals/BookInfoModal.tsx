import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UIModal } from '@/ui/UIModal';
import { UIRating } from '@/ui/UIRating';
import { useBook } from '@/lib/hooks/useBooks';
import type { Book } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { launchImagePicker } from '@/lib/utils/image-picker';

type Props = {
	readonly book?: Book;
	readonly isVisible: boolean;
	readonly canAdd?: boolean;
	readonly onUpdateBook?: (book: Book) => void;
	readonly onClose: VoidFunction;
	readonly onSuccessfulAdd?: VoidFunction;
};

export const BookInfoModal = (props: Props) => {
	const { getBookDescription } = useBook();
	const { onAddBook, onUpdateBook, onRemoveBook } = useBooksStore();
	const [bookDescription, setBookDescription] = useState<string | undefined>(undefined);

	const onClose = () => {
		props.onClose();
		setBookDescription(undefined);
	};

	const onAddNewBook = () => {
		if (!props.book) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		onAddBook(props.book);
		onClose();

		if (props.onSuccessfulAdd) {
			props.onSuccessfulAdd();
		}
	};

	const onRemoveExistingBook = () => {
		if (!props.book) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		onRemoveBook(props.book.bookId);
		onClose();
	};

	useEffect(() => {
		if (!props.book) return;

		getBookDescription(props.book.bookId).then((description) => {
			setBookDescription(description);
		});
	}, [props.book]);

	const openGoodreads = (bookId?: number, goodreadsLink?: string) => {
		const appUrl = `goodreads://book/show/${bookId}`;
		const webUrl = goodreadsLink;

		Linking.canOpenURL(appUrl).then((supported) => {
			if (supported) {
				Linking.openURL(appUrl);
			} else if (webUrl) {
				Linking.openURL(webUrl);
			}
		});
	};

	const onChangeBookCoverImage = async () => {
		const uploadedImage = await launchImagePicker();

		if (!uploadedImage) return;

		const updatedBook = { ...props.book, bookCoverUrl: uploadedImage } as unknown as Book;

		props.onUpdateBook?.(updatedBook);
		onUpdateBook(updatedBook);
	};

	return (
		<UIModal isOpen={props.isVisible} modalHeaderTitle={props.book?.title ?? ''} size={props.canAdd ? 'large' : 'smallToBig'} onClose={onClose}>
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
						<Text className="text-lg font-semibold text-gray-600">Number of pages: </Text>
						<Text className="flex-shrink text-lg text-gray-600">{props.book?.numberOfPages}</Text>
					</View>

					{props.canAdd && (
						<Pressable className="mb-2 flex self-start rounded bg-blue-300 p-2" onPress={onAddNewBook}>
							<Text className="text-lg font-semibold text-white">Add to your library 📚</Text>
						</Pressable>
					)}
				</View>
				<View className="relative">
					<Image source={{ uri: props.book?.bookCoverUrl }} className="h-[170px] w-[110px] shadow-lg" resizeMode="cover" />
					{props.onUpdateBook && (
						<Pressable className="absolute right-1 top-1 self-end" onPress={onChangeBookCoverImage}>
							<Icon name="edit" color="gray" size={20} />
						</Pressable>
					)}
				</View>
			</View>

			<View className="mb-4 ml-4 mt-4 self-start">
				<Text className="text-lg font-semibold text-gray-600">For more info:</Text>
				<TouchableOpacity onPress={() => openGoodreads(props.book?.bookId, props.book?.goodreadsLink)}>
					<Image source={require('@/assets/images/goodreads-logo.png')} className="h-[43px] w-[200px]" resizeMode="cover" />
				</TouchableOpacity>
			</View>

			{props.book?.description && (
				<View className="mb-4 flex flex-row flex-wrap items-center px-4">
					<Text className="text-lg font-semibold text-gray-600">Description: </Text>
					<RenderHtml contentWidth={100} source={{ html: props.book.description }} />
				</View>
			)}
			{bookDescription && (
				<View className="px-4 pb-4">
					<Text className="text-lg font-semibold text-gray-600">Book reviews:</Text>
					<UIRating rating={props.book?.averageRating ?? 0} readonly imageSize={30} showRating />

					<RenderHtml contentWidth={100} source={{ html: bookDescription }} />
				</View>
			)}
			{!props.canAdd && (
				<Pressable className="my-2 flex flex-row items-center self-start rounded bg-red-400 px-4 py-2" onPress={onRemoveExistingBook}>
					<Icon name="delete" color="white" size={20} />
					<Text className="text-l font-semibold text-white">Remove</Text>
				</Pressable>
			)}
		</UIModal>
	);
};
