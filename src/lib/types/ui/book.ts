export type Book = {
	readonly bookId: number;
	readonly title: string;
	readonly author: string;
	readonly authorLf: string;
	readonly additionalAuthors: string;
	readonly isbn: string;
	readonly isbn13: string;
	readonly myRating: number;
	readonly averageRating: number;
	readonly publisher: string;
	readonly binding: string;
	readonly numberOfPages: number | undefined;
	readonly yearPublished: number;
	readonly originalPublicationYear: number;
	readonly dateRead: string;
	readonly bookshelves: string;
	readonly bookshelvesWithPositions: string;
	readonly exclusiveShelf: string;
	readonly myReview: string;
	readonly spoiler: string;
	readonly privateNotes: string;
	readonly readCount: number;
	readonly ownedCopies: number;
	readonly bookCoverUrl?: string;
	readonly goodreadsLink?: string;
	readonly description?: string;
};

export type FilterTabs = 'all' | 'to-read';

export type Filters = {
	readonly minimumRating: number;
	readonly maxNumberOfPages: string;
};

export type DescriptionAndReviewsCount = {
	readonly description: string;
	readonly textReviewsCount: string;
	readonly ratingsCount: string;
	readonly similarBooks: Book[];
};
