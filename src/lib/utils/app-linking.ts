// utils/appLinkingUtils.ts
import { Linking } from 'react-native';

/**
 * Navigate to TikTok with a search query.
 * Opens the TikTok app if installed, otherwise falls back to the TikTok website.
 *
 * @param {string} query - The search query to use in TikTok.
 */
export const navigateToTikTokSearch = async (query: string) => {
	const url = `snssdk1128://search?keyword=${encodeURIComponent(query)}`;
	const fallbackUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(query)}`;

	try {
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			Linking.openURL(url);
		} else {
			Linking.openURL(fallbackUrl);
		}
	} catch (error) {
		console.error('Failed to open TikTok:', error);
		Linking.openURL(fallbackUrl);
	}
};

/**
 * Navigate to Google with a search query.
 * Opens the Google search results page in the default browser.
 *
 * @param {string} query - The search query to use in Google.
 */
export const navigateToGoogleSearch = async (query: string) => {
	const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

	try {
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			Linking.openURL(url);
		} else {
			Linking.openURL(url); // Fallback to the same URL in the browser
		}
	} catch (error) {
		console.error('Failed to open Google:', error);
		Linking.openURL(url);
	}
};

/**
 * Navigate to Instagram with a search query.
 * Opens the Instagram app if installed, otherwise falls back to the Instagram website.
 *
 * @param {string} query - The search query to use in Instagram.
 */
export const navigateToInstagramSearch = async (query: string) => {
	const url = `instagram://search?query=${encodeURIComponent(query)}`;
	const fallbackUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(query)}`;

	try {
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			Linking.openURL(url);
		} else {
			Linking.openURL(fallbackUrl);
		}
	} catch (error) {
		console.error('Failed to open Instagram:', error);
		Linking.openURL(fallbackUrl);
	}
};

/**
 * Navigate to Goodreads for a given link
 * Opens the Goodreads app if installed, otherwise falls back to the Goodreads website.
 *
 * @param {string} goodreadsLink - The Goodreads link to navigate to.
 */
export const navigateToGoodreads = async (goodreadsLink: string) => {
	try {
		const supported = await Linking.canOpenURL(goodreadsLink);

		if (supported) {
			Linking.openURL(goodreadsLink);
		} else {
			Linking.openURL(goodreadsLink);
		}
	} catch (error) {
		console.error('Failed to open Goodreads:', error);
		Linking.openURL(goodreadsLink);
	}
};

// const openGoodreads = (goodreadsLink?: string) => {
// 	if (!goodreadsLink) return;

// 	Linking.openURL(goodreadsLink);
// };
