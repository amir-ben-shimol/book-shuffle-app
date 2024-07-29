import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import type { TextStyle } from 'react-native';
import * as stories from './UITitle.stories';

const { Default, SmallTitle, MediumTitle, LargeTitle } = composeStories(stories);

/**
 * Test that ensures the default UITitle renders with the correct text.
 * It renders the default story and verifies that the text 'This is a title' is present.
 */
test('renders default UITitle', () => {
	render(<Default />);
	const titleElement = screen.getByText('This is a title');

	expect(titleElement).not.toBeNull();
});

/**
 * Test that ensures the UITitle component renders with small size.
 * It renders the story with small size and verifies that the text 'This is a small title' is present.
 */
test('renders small UITitle', () => {
	render(<SmallTitle />);
	const titleElement = screen.getByText('This is a small title');

	expect(titleElement).not.toBeNull();
	expect(titleElement.props.style.some((style: TextStyle) => style.fontSize === 18)).toBe(true);
});

/**
 * Test that ensures the UITitle component renders with medium size.
 * It renders the story with medium size and verifies that the text 'This is a medium title' is present.
 */
test('renders medium UITitle', () => {
	render(<MediumTitle />);
	const titleElement = screen.getByText('This is a medium title');

	expect(titleElement).not.toBeNull();
	expect(titleElement.props.style.some((style: TextStyle) => style.fontSize === 20)).toBe(true);
});

/**
 * Test that ensures the UITitle component renders with large size.
 * It renders the story with large size and verifies that the text 'This is a large title' is present.
 */
test('renders large UITitle', () => {
	render(<LargeTitle />);
	const titleElement = screen.getByText('This is a large title');

	expect(titleElement).not.toBeNull();
	expect(titleElement.props.style.some((style: TextStyle) => style.fontSize === 24)).toBe(true);
});
