import { TouchableOpacity, View, Text, Image, type ViewStyle } from 'react-native';
import type { Book } from '@/lib/types/ui/book';
import { cn } from '@/lib/utils/component';

type Props = {
	readonly book: Book;
	readonly showInLibrary?: boolean;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly isInLibrary?: boolean;
	readonly onPress?: (book: Book) => void;
};

export const UIBookCover = (props: Props) => {
	const showBadges = !props.book.bookshelves.includes('to-read') || (props.isInLibrary && props.showInLibrary);

	if (props.onPress) {
		return (
			<TouchableOpacity key={props.book.bookId} className={cn('', props.className)} style={props.style} onPress={() => props.onPress!(props.book)}>
				<View className="flex overflow-hidden rounded">
					{props.book.bookCoverUrl && (
						<Image source={{ uri: props.book.bookCoverUrl }} className="h-[170px] w-full" resizeMode="cover" testID="book-cover" />
					)}
				</View>
				{showBadges && (
					<View className="absolute -left-6 top-4 -rotate-45">
						{!props.book.bookshelves.includes('to-read') && <Text className="w-24 bg-green-700 px-5 text-center text-white">Read</Text>}
						{props.isInLibrary && props.showInLibrary && (
							<Text className="whitespace-nowrap bg-blue-700 px-6 text-center text-white">In library</Text>
						)}
					</View>
				)}
			</TouchableOpacity>
		);
	}

	return (
		<View key={props.book.bookId} className={cn('h-36 w-24 overflow-hidden', props.className)} style={props.style}>
			<View className="flex overflow-hidden rounded">
				{props.book.bookCoverUrl && <Image source={{ uri: props.book.bookCoverUrl }} className="h-36 w-24" resizeMode="cover" testID="book-cover" />}
			</View>
			{showBadges && (
				<View className="absolute -left-6 top-4 -rotate-45">
					{!props.book.bookshelves.includes('to-read') && <Text className="bg-green-700 px-5 text-center text-white">Read</Text>}
					{props.isInLibrary && props.showInLibrary && (
						<Text className="-ml-4 w-36 whitespace-nowrap bg-blue-900 text-center font-bold text-white">In library</Text>
					)}
				</View>
			)}
		</View>
	);
};
