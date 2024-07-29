import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UIBookCover } from '@/ui/UIBookCover';
import type { Book } from '@/lib/types/ui/book';

const mockBook: Book = {
	bookId: 209807879,
	title: 'Play Along (Windy City, #4)',
	author: 'Liz Tomforde',
	bookCoverUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1710337971l/209807879._SX500_.jpg',
	bookshelves: 'read',
	goodreadsLink: 'https://www.goodreads.com/book/show/209807879-play-along',
	additionalAuthors: '',
	isbn: '',
	isbn13: '',
	myRating: 4,
	averageRating: 4.62,
	publisher: 'Golden Boy Publishing LLC',
	binding: 'Kindle Edition',
	numberOfPages: 384,
	yearPublished: 2024,
	originalPublicationYear: 2024,
	dateRead: '2024/07/15',
	exclusiveShelf: 'read',
	myReview: '',
	spoiler: '',
	privateNotes: '',
	readCount: 1,
	ownedCopies: 0,
	bookshelvesWithPositions: '',
	authorLf: '',
};

const UIBookCoverMeta: Meta<typeof UIBookCover> = {
	title: 'UIBookCover',
	component: UIBookCover,
	argTypes: {
		onPress: { action: 'book pressed' },
	},
	args: {
		book: mockBook,
	},
	decorators: [
		(Story) => (
			<View className="item over flex h-full w-40 justify-center self-center p-4">
				<Story />
			</View>
		),
	],
};

export default UIBookCoverMeta;

export const Default: StoryObj<typeof UIBookCover> = {};

export const InLibrary: StoryObj<typeof UIBookCover> = {
	args: {
		book: { ...mockBook, bookshelves: 'to-read' },
		showInLibrary: true,
		isInLibrary: true,
	},
};

export const Read: StoryObj<typeof UIBookCover> = {
	args: {
		book: { ...mockBook, bookshelves: 'read' },
	},
};
