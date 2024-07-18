/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const { parseStringPromise } = require('xml2js');

const API_KEY = 'Ys0aMCpm754ABIoafSezZw'; // Replace with your actual Goodreads API key
const booksList = require('../data/books-list.json'); // Adjust the path if necessary

const fetchBookImageUrl = async (bookId) => {
	try {
		const response = await axios.get(`https://www.goodreads.com/book/show/${bookId}.xml?key=${API_KEY}`);

		const result = await parseStringPromise(response.data);
		const imageUrl = result?.GoodreadsResponse?.book?.[0]?.image_url?.[0];

		return imageUrl || undefined;
	} catch (error) {
		console.error(`Error fetching book image URL for bookId ${bookId}:`, error);

		return undefined;
	}
};

const updateBooksList = async () => {
	const updatedBooks = await Promise.all(
		booksList.map(async (book) => {
			const bookCoverUrl = await fetchBookImageUrl(book['Book Id']);

			return { ...book, bookCoverUrl };
		}),
	);

	const outputPath = path.join(__dirname, '../lib/data/books-list-updated.json');

	fs.writeFileSync(outputPath, JSON.stringify(updatedBooks, null, 2), 'utf8');

	console.log('Updated books list saved to books-list-updated.json');
};

updateBooksList();
