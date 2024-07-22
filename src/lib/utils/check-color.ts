/**
 * Check if a color is dark or light based on its hex value.
 * @param colorHex - The hex value of the color (e.g., '#FFFFFF' or '#000000').
 * @returns 'dark' if the color is dark, 'light' if the color is light.
 */
export const isDarkOrLight = (colorHex: string): 'dark' | 'light' => {
	// Remove the hash if present
	const hex = colorHex.replace('#', '');

	// Convert hex to RGB
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// Calculate brightness
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// Adjusted threshold to better classify light colors
	return brightness > 180 ? 'light' : 'dark';
};
