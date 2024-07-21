/* eslint-disable max-lines */
import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UIModal } from '@/ui/UIModal';
import { UIRating } from '@/ui/UIRating';
import { useBook } from '@/lib/hooks/useBooks';
import type { Book, DescriptionAndReviewsCount } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { launchImagePicker } from '@/lib/utils/image';
import { UIParallaxScrollView } from '@/ui/UIParallaxScrollView';
import { formatNumberWithCommas } from '@/lib/utils/format';
import { splitBookTitleAndSubtitle } from '@/lib/utils/book';

type Props = {
	readonly book?: Book;
	readonly isVisible: boolean;
	readonly canAdd?: boolean;
	readonly bookCoverBackgroundColors: string[];
	readonly onUpdateBook?: (book: Book) => void;
	readonly onClose: VoidFunction;
	readonly onSuccessfulAdd?: VoidFunction;
};

export const BookInfoModal = (props: Props) => {
	const { getBookDescriptionAndReviewsCount } = useBook();
	const { onAddBook, onUpdateBook, onRemoveBook } = useBooksStore();
	const [bookDescriptionAndReviewsCount, setBookDescriptionAndReviewsCount] = useState<DescriptionAndReviewsCount | undefined>(undefined);

	const onClose = () => {
		props.onClose();
		setBookDescriptionAndReviewsCount(undefined);
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

	const fetchData = async () => {
		if (!props.book) return;

		const descriptionAndReviewsCountResults = await getBookDescriptionAndReviewsCount(props.book.bookId);

		if (!descriptionAndReviewsCountResults) return;

		setBookDescriptionAndReviewsCount(descriptionAndReviewsCountResults);
	};

	useEffect(() => {
		if (!props.book) return;

		fetchData();
	}, [props.book]);

	const openGoodreads = (goodreadsLink?: string) => {
		if (!goodreadsLink) return;

		Linking.openURL(goodreadsLink);
	};

	const onChangeBookCoverImage = async () => {
		const uploadedImage = await launchImagePicker();

		if (!uploadedImage) return;

		const updatedBook = { ...props.book, bookCoverUrl: uploadedImage } as unknown as Book;

		props.onUpdateBook?.(updatedBook);
		onUpdateBook(updatedBook);
	};

	const BookVocerImage = (
		<View className="relative">
			<Image source={{ uri: props.book?.bookCoverUrl }} className="h-[280px] w-[190px]" resizeMode="cover" />
			{props.onUpdateBook && (
				<Pressable className="absolute right-1 top-1 self-end" onPress={onChangeBookCoverImage}>
					<Icon name="edit" color="gray" size={20} />
				</Pressable>
			)}
		</View>
	);

	return (
		<UIModal
			isOpen={props.isVisible}
			scrollable={false}
			className="p-0"
			noHeader
			modalHeaderTitle={props.book?.title ?? ''}
			size={props.canAdd ? 'large' : 'full'}
			onClose={onClose}
		>
			<UIParallaxScrollView
				childrenTitle={splitBookTitleAndSubtitle(props?.book?.title ?? '').title}
				headerBackgroundColor={props.bookCoverBackgroundColors}
				headerImage={BookVocerImage}
			>
				<View className="relative bg-white px-4 pb-40">
					<Pressable className="absolute left-2 top-2 z-50 rounded-full bg-slate-300 p-1" onPress={onClose}>
						<Icon name="close" color="gray" size={20} />
					</Pressable>
					<View className="mt-4 flex items-center">
						{props.book?.title && splitBookTitleAndSubtitle(props.book.title).title && (
							<Text className="text-center text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia' }}>
								{splitBookTitleAndSubtitle(props.book?.title).title}
							</Text>
						)}
						{props.book?.title && splitBookTitleAndSubtitle(props.book?.title).subTitle && (
							<Text className="text-center text-xl font-semibold text-gray-400">{`(${splitBookTitleAndSubtitle(props.book?.title).subTitle})`}</Text>
						)}
						<Text className="mt-2 font-semibold text-gray-800">{`by ${props.book?.author}`}</Text>
						<View className="mb-4 mt-6 flex w-full flex-row items-center justify-between border-b border-t border-gray-400">
							<UIRating rating={props.book?.averageRating ?? 0} imageSize={18} readonly />
							<View className="flex flex-row items-center">
								{bookDescriptionAndReviewsCount?.ratingsCount && (
									<Text className="mr-2 text-[12px] text-gray-400">{`${formatNumberWithCommas(+bookDescriptionAndReviewsCount?.ratingsCount)} ratings`}</Text>
								)}
								{bookDescriptionAndReviewsCount?.textReviewsCount && (
									<Text className="mr-2 text-[12px] text-gray-400">{`${formatNumberWithCommas(+bookDescriptionAndReviewsCount?.textReviewsCount)} reviews`}</Text>
								)}
							</View>
						</View>
					</View>
					<View className="flex w-full flex-row items-start justify-between">
						<View className="flex w-2/3 items-start justify-center">
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
					</View>

					<View className="mb-4 mt-4 self-start">
						<Text className="text-lg font-semibold text-gray-600">For more info:</Text>
						<TouchableOpacity onPress={() => openGoodreads(props.book?.goodreadsLink)}>
							<Image source={require('@/assets/images/goodreads-logo.png')} className="h-[43px] w-[200px]" resizeMode="cover" />
						</TouchableOpacity>
					</View>

					{props.book?.description && (
						<View className="mb-4 flex flex-row flex-wrap items-center">
							<Text className="text-lg font-semibold text-gray-600">Description: </Text>
							<RenderHtml contentWidth={100} source={{ html: props.book.description }} />
						</View>
					)}
					{bookDescriptionAndReviewsCount?.description && (
						<View className="pb-4">
							<Text className="text-lg font-semibold text-gray-600">Book reviews:</Text>
							<UIRating rating={props.book?.averageRating ?? 0} readonly imageSize={30} showRating />

							<RenderHtml contentWidth={100} source={{ html: bookDescriptionAndReviewsCount.description }} />
						</View>
					)}
					{!props.canAdd && (
						<Pressable className="my-2 flex flex-row items-center self-start rounded bg-red-400 px-4 py-2" onPress={onRemoveExistingBook}>
							<Icon name="delete" color="white" size={20} />
							<Text className="text-l font-semibold text-white">Remove</Text>
						</Pressable>
					)}
				</View>
			</UIParallaxScrollView>
		</UIModal>
	);
};
