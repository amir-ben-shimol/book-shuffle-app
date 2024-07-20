/**
 * Formats a number with commas as thousand separators
 * @param num The number to format
 * @returns The formatted number as a string
 */
export const formatNumberWithCommas = (num: number): string => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
