/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Book } from '../types/ui/book';

export const convertToBookArray = (jsonData: any[]): Book[] => {
	return jsonData.map((item): Book => {
		return {
			bookId: item['Book Id'],
			title: item['Title'],
			author: item['Author'],
			authorLf: item['Author l-f'],
			additionalAuthors: item['Additional Authors'],
			isbn: item['ISBN'],
			isbn13: item['ISBN13'],
			myRating: item['My Rating'],
			averageRating: item['Average Rating'],
			publisher: item['Publisher'],
			binding: item['Binding'],
			numberOfPages: item['Number of Pages'],
			yearPublished: item['Year Published'],
			originalPublicationYear: item['Original Publication Year'],
			dateRead: item['Date Read'],
			bookshelves: item['Bookshelves'],
			bookshelvesWithPositions: item['Bookshelves with positions'],
			exclusiveShelf: item['Exclusive Shelf'],
			myReview: item['My Review'],
			spoiler: item['Spoiler'],
			privateNotes: item['Private Notes'],
			readCount: item['Read Count'],
			ownedCopies: item['Owned Copies'],
			bookCoverUrl: item['bookCoverUrl'],
			goodreadsLink: item['goodreadsLink'],
			description: item['description'],
		};
	});
};
