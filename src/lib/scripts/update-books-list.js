/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const { parseStringPromise } = require('xml2js');

const API_KEY = 'Ys0aMCpm754ABIoafSezZw'; // Replace with your actual Goodreads API key

const booksList = require('../data/books-list.json'); // Adjust the path if necessary

const fetchBookInfo = async (bookId) => {
	try {
		const response = await axios.get(`https://www.goodreads.com/book/show/${bookId}.xml?key=${API_KEY}`);

		const result = await parseStringPromise(response.data);
		let imageUrl = result?.GoodreadsResponse?.book?.[0]?.image_url?.[0];
		const description = result?.GoodreadsResponse?.book?.[0]?.description?.[0];
		const goodreadsLink = result?.GoodreadsResponse?.book?.[0]?.link?.[0];

		if (imageUrl) {
			// Modify the URL to get a higher quality image
			imageUrl = imageUrl.replace(/_SX98_/, '_SX500_'); // Change `_SX98_` to `_SX500_` or any higher value you need
		}

		return { bookCoverUrl: imageUrl, goodreadsLink, description };
	} catch (error) {
		console.error(`Error fetching book info for bookId ${bookId}:`, error);

		return { bookCoverUrl: undefined, goodreadsLink: undefined, description: undefined };
	}
};

const ensureDirectoryExistence = (filePath) => {
	const dirname = path.dirname(filePath);

	if (fs.existsSync(dirname)) {
		console.log('Directory already exists:', dirname);

		return true;
	}

	fs.mkdirSync(dirname, { recursive: true });
};

const updateBooksList = async () => {
	const updatedBooks = await Promise.all(
		booksList.map(async (book) => {
			const { bookCoverUrl, goodreadsLink, description } = await fetchBookInfo(book['Book Id']);

			return { ...book, bookCoverUrl, goodreadsLink, description };
		}),
	);

	const outputPath = path.join(__dirname, '../data/books-list-updated.json');

	ensureDirectoryExistence(outputPath);

	fs.writeFileSync(outputPath, JSON.stringify(updatedBooks, null, 2), 'utf8');

	console.log('Updated books list saved to books-list-updated.json');
};

updateBooksList();
