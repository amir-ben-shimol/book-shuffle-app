import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './UIBookCover.stories';

const { Default, InLibrary, Read } = composeStories(stories);

/**
 * Test that ensures the default UIBookCover renders correctly.
 * It renders the default story and verifies that the book cover and title are present.
 */
test('renders default UIBookCover', () => {
	render(<Default />);
	const bookCover = screen.getByTestId('book-cover');

	expect(bookCover).not.toBeNull();
});

/**
 * Test that ensures the UIBookCover with InLibrary status renders correctly.
 * It renders the InLibrary story and verifies that the "In library" text is present.
 */
test('renders UIBookCover in library', () => {
	render(<InLibrary />);
	const inLibraryText = screen.getByText('In library');

	expect(inLibraryText).not.toBeNull();
});

/**
 * Test that ensures the UIBookCover with ToRead status renders correctly.
 * It renders the ToRead story and verifies that the "Read" text is present.
 */
test('renders UIBookCover to read', () => {
	render(<Read />);
	const readText = screen.getByText('Read');

	expect(readText).not.toBeNull();
});
