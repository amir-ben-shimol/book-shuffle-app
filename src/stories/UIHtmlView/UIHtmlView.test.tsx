import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './UIHtmlView.stories';

// Compose the stories from the Storybook file for testing
const { Default } = composeStories(stories);

/**
 * Test that ensures the default UIHtmlView renders correctly.
 * It renders the default story and verifies that the link text is present.
 */
test('renders default UIHtmlView', () => {
	render(<Default />);
	const linkText = screen.getByText('link');

	expect(linkText).not.toBeNull();
});
