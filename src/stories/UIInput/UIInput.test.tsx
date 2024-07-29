import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './UIInput.stories';

const { Default, WithLabel, WithIcon } = composeStories(stories);

/**
 * Test that ensures the default UIInput renders with the correct placeholder text.
 * It renders the default story and verifies that the input element with the placeholder 'Search for books' is present.
 */
test('renders default UIInput with placeholder', () => {
	render(<Default />);
	const inputElement = screen.getByPlaceholderText('Search for books');

	expect(inputElement).not.toBeNull();
});

/**
 * Test that ensures the UIInput component renders with a label when provided.
 * It renders the story with a label and verifies that the label text 'First Name' is present.
 */
test('renders UIInput with label', () => {
	render(<WithLabel />);
	const labelElement = screen.getByText('First Name');

	expect(labelElement).not.toBeNull();
});

/**
 * Test that ensures the UIInput component renders with an icon when provided.
 * It renders the story with an icon and verifies that the icon element with the testID 'input-icon' is present.
 */
test('renders UIInput with icon', () => {
	render(<WithIcon />);
	const iconElement = screen.getByTestId('input-icon');

	expect(iconElement).not.toBeNull();
});
