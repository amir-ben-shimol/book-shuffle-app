// src/hooks/useBook.ts
import { parseStringPromise } from 'xml2js';
import { BackendService } from '../utils/backend-service';

const API_KEY = 'Ys0aMCpm754ABIoafSezZw'; // Replace with your actual Goodreads API key

// Function to fetch and return the image URL of a single book
export const useBook = () => {
	const fetchBookImageUrl = async (bookId: number): Promise<string | undefined> => {
		try {
			const response = await BackendService.get<string>(`https://www.goodreads.com/book/show/${bookId}.xml?key=${API_KEY}`);

			const result = await parseStringPromise(response);
			const imageUrl = result?.GoodreadsResponse?.book?.[0]?.image_url?.[0];

			return imageUrl || undefined;
		} catch (error) {
			console.error('Error fetching book image URL:', error);

			return undefined;
		}
	};

	return { fetchBookImageUrl };
};
