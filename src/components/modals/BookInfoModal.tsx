/* eslint-disable max-lines */
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UIModal } from '@/ui/UIModal';
import { UIRating } from '@/ui/UIRating';
import { useBook } from '@/lib/hooks/useBooks';
import type { Book, DescriptionAndReviewsCount } from '@/lib/types/ui/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { getImageDominantColor, launchImagePicker } from '@/lib/utils/image';
import { UIParallaxScrollView } from '@/ui/UIParallaxScrollView';
import { formatNumberWithCommas } from '@/lib/utils/format';
import { splitBookTitleAndSubtitle } from '@/lib/utils/book';
import { UIBookCover } from '@/ui/UIBookCover';
import { UIHtmlView } from '@/ui/UIHtmlView';

type Props = {
	readonly book?: Book;
	readonly isVisible: boolean;
	readonly bookCoverBackgroundColors: string[];
	readonly onClose: VoidFunction;
	readonly onSuccessfulAdd?: VoidFunction;
	readonly onUpdateBook?: (book: Book) => void;
};

export const BookInfoModal = (props: Props) => {
	const { getBookDescriptionAndReviewsCount } = useBook();
	const { booksList, onAddBook, onUpdateBook, onRemoveBook, onAddRecentlyViewedBook } = useBooksStore();
	const [booksStack, setBooksStack] = useState<Book[]>([]);
	const [booksCoverBackgroundColorsStack, setBooksCoverBackgroundColorsStack] = useState<string[][]>([]);
	const [bookDescriptionAndReviewsCount, setBookDescriptionAndReviewsCount] = useState<DescriptionAndReviewsCount | undefined>(undefined);
	const [isLoadingExtraData, setIsLoadingExtraData] = useState(false);
	const scrollViewRef = useRef<{ scrollToTop: () => void }>(null);

	const currentBook = booksStack[booksStack.length - 1];
	const currentBookCoverBackgroundColors = booksCoverBackgroundColorsStack[booksCoverBackgroundColorsStack.length - 1] ?? [];

	const onClose = () => {
		props.onClose();
		setBooksStack([]);
		setBooksCoverBackgroundColorsStack([]);
		setBookDescriptionAndReviewsCount(undefined);
	};

	const onAddNewBook = () => {
		if (!currentBook) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		onAddBook(currentBook);
		onClose();

		if (props.onSuccessfulAdd) {
			props.onSuccessfulAdd();
		}
	};

	const onRemoveExistingBook = () => {
		if (!currentBook) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		onRemoveBook(currentBook.bookId);
		onClose();
	};

	const fetchData = async (bookId: number) => {
		try {
			setIsLoadingExtraData(true);

			const descriptionAndReviewsCountResults = await getBookDescriptionAndReviewsCount(bookId);

			if (!descriptionAndReviewsCountResults) return;

			setBookDescriptionAndReviewsCount(descriptionAndReviewsCountResults);
		} catch (error) {
			console.error('Error fetching book description and reviews count:', error);
		} finally {
			setIsLoadingExtraData(false);
		}
	};

	useEffect(() => {
		if (!props.book) return;

		if (props.bookCoverBackgroundColors.length > 0) {
			setBooksCoverBackgroundColorsStack([props.bookCoverBackgroundColors]);
		}

		setBooksStack([props.book]);

		fetchData(props.book.bookId);
	}, [props.book, props.bookCoverBackgroundColors]);

	const openGoodreads = (goodreadsLink?: string) => {
		if (!goodreadsLink) return;

		Linking.openURL(goodreadsLink);
	};

	const onChangeBookCoverImage = async () => {
		const uploadedImage = await launchImagePicker();

		if (!uploadedImage) return;

		const updatedBook = { ...currentBook, bookCoverUrl: uploadedImage } as unknown as Book;

		props.onUpdateBook?.(updatedBook);
		onUpdateBook(updatedBook);
	};

	const fetchBookCoverColors = async (bookCoverImage: string) => {
		const colors = await getImageDominantColor(bookCoverImage);

		if (colors.length > 0) {
			setBooksCoverBackgroundColorsStack([...booksCoverBackgroundColorsStack, colors]);
		}
	};

	const onClickSimilarBook = (book: Book) => {
		if (book.bookCoverUrl) {
			fetchBookCoverColors(book.bookCoverUrl);
		}

		onAddRecentlyViewedBook(book);
		setBooksStack([...booksStack, book]);
		fetchData(book.bookId);
		scrollViewRef.current?.scrollToTop();
	};

	const isBookInUserLibrary = useMemo(() => {
		return booksList.some((book) => book.bookId === currentBook?.bookId);
	}, [booksList, currentBook]);

	const BookCoverImage = (
		<View className="relative">
			<Image source={{ uri: currentBook?.bookCoverUrl }} className="h-[280px] w-[190px]" resizeMode="cover" />
			{props.onUpdateBook && (
				<Pressable className="absolute right-1 top-1 self-end" onPress={onChangeBookCoverImage}>
					<Icon name="edit" color="gray" size={20} />
				</Pressable>
			)}
		</View>
	);

	return (
		<UIModal isOpen={props.isVisible} scrollable={false} className="p-0" noHeader modalHeaderTitle={currentBook?.title ?? ''} size="full" onClose={onClose}>
			<UIParallaxScrollView
				ref={scrollViewRef}
				childrenTitle={splitBookTitleAndSubtitle(currentBook?.title ?? '').title}
				headerBackgroundColor={currentBookCoverBackgroundColors}
				headerImage={BookCoverImage}
			>
				<View className="relative bg-white px-4 pb-40">
					<Pressable className="absolute left-2 top-2 z-50 rounded-full bg-slate-300 p-1" onPress={onClose}>
						<Icon name="close" color="gray" size={20} />
					</Pressable>
					<View className="mt-4 flex items-center">
						{currentBook?.title && splitBookTitleAndSubtitle(currentBook.title).title && (
							<Text className="px-4 text-center text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia' }}>
								{splitBookTitleAndSubtitle(currentBook?.title).title}
							</Text>
						)}
						{currentBook?.title && splitBookTitleAndSubtitle(currentBook?.title).subTitle && (
							<Text className="text-center text-xl font-semibold text-gray-400">{`(${splitBookTitleAndSubtitle(currentBook?.title).subTitle})`}</Text>
						)}
						<Text className="mt-2 font-semibold text-gray-800">{`by ${currentBook?.author}`}</Text>
						<View className="mb-4 mt-6 flex w-full flex-row items-center justify-between border-b border-t border-gray-400">
							<UIRating rating={currentBook?.averageRating ?? 0} showRatingNumber imageSize={18} readonly />
							<View className="flex flex-row items-center">
								{isLoadingExtraData ? (
									<View className="flex flex-row items-center justify-between">
										<View className="mr-2 h-4 w-20 rounded bg-gray-200" />
										<View className="h-4 w-20 rounded bg-gray-200" />
									</View>
								) : (
									<>
										{bookDescriptionAndReviewsCount?.ratingsCount && (
											<Text className="mr-2 text-[12px] text-gray-400">{`${formatNumberWithCommas(+bookDescriptionAndReviewsCount?.ratingsCount)} ratings`}</Text>
										)}
										{bookDescriptionAndReviewsCount?.textReviewsCount && (
											<Text className="mr-2 text-[12px] text-gray-400">{`${formatNumberWithCommas(+bookDescriptionAndReviewsCount?.textReviewsCount)} reviews`}</Text>
										)}
									</>
								)}
							</View>
						</View>
					</View>

					<View className="flex w-full flex-row items-start justify-between">
						<View className="flex w-2/3 items-start justify-center">
							{!isBookInUserLibrary && (
								<Pressable className="mb-2 flex self-start rounded bg-blue-300 p-2" onPress={onAddNewBook}>
									<Text className="text-lg font-semibold text-white">Add to your library 📚</Text>
								</Pressable>
							)}
							{!!currentBook?.numberOfPages && (
								<View className="mb-2 flex flex-row flex-wrap items-center">
									<Text className="text-lg font-semibold text-gray-600">Number of pages: </Text>
									<Text className="flex-shrink text-lg text-gray-600">{currentBook?.numberOfPages}</Text>
								</View>
							)}
						</View>
					</View>

					{isLoadingExtraData ? (
						<View className="mb-4">
							<View className="mb-2 h-5 w-28 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-80 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-72 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-60 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-60 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-64 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-72 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-80 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-60 rounded bg-gray-200" />
							<View className="mb-1 h-3 w-80 rounded bg-gray-200" />
						</View>
					) : (
						bookDescriptionAndReviewsCount?.description && (
							<View className="mb-4">
								<Text className="mb-2 text-lg font-semibold text-gray-600">Description: </Text>
								<UIHtmlView value={bookDescriptionAndReviewsCount.description} />
							</View>
						)
					)}

					<View className="mb-4 mt-4 self-start">
						<Text className="text-lg font-semibold text-gray-600">For more info:</Text>
						<TouchableOpacity onPress={() => openGoodreads(currentBook?.goodreadsLink)}>
							<Image source={require('@/assets/images/goodreads-logo.png')} className="h-[43px] w-[200px]" resizeMode="cover" />
						</TouchableOpacity>
					</View>
					{bookDescriptionAndReviewsCount && bookDescriptionAndReviewsCount.similarBooks.length > 0 && (
						<View className="mb-4">
							<Text className="mb-2 text-lg font-semibold text-gray-600">Similar books: </Text>
							<View className="flex flex-row flex-wrap items-center">
								{bookDescriptionAndReviewsCount.similarBooks.map((book) => {
									const isInLibrary = booksList.some((bookFromList) => book.bookId === bookFromList?.bookId);

									return (
										<TouchableOpacity key={book.bookId} className="mb-4 flex flex-row items-start" onPress={() => onClickSimilarBook(book)}>
											<UIBookCover book={book} className="mr-4" showInLibrary isInLibrary={isInLibrary} />
											<View className="flex flex-1">
												{book?.title && splitBookTitleAndSubtitle(book.title).title && (
													<Text className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia' }}>
														{splitBookTitleAndSubtitle(book?.title).title}
													</Text>
												)}
												{book?.title && splitBookTitleAndSubtitle(book?.title).subTitle && (
													<Text className="text-l font-semibold text-gray-400">{`(${splitBookTitleAndSubtitle(book?.title).subTitle})`}</Text>
												)}
												<Text className="my-1 text-sm text-gray-600">{`by ${book.author}`}</Text>
												{!!book.numberOfPages && <Text className="text-sm text-gray-600">{`${book.numberOfPages} pages`}</Text>}
												<UIRating className="self-start" showRatingNumber imageSize={15} rating={book.averageRating} />
											</View>
										</TouchableOpacity>
									);
								})}
							</View>
						</View>
					)}
					{isBookInUserLibrary && (
						<Pressable className="my-2 flex flex-row items-center self-start rounded bg-red-400 px-4 py-2" onPress={onRemoveExistingBook}>
							<Icon name="delete" color="white" size={20} />
							<Text className="text-l font-semibold text-white">Remove book from your library</Text>
						</Pressable>
					)}
				</View>
			</UIParallaxScrollView>
		</UIModal>
	);
};
