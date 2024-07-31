import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './UIHelloWave.stories';

// Compose the stories from the Storybook file for testing
const { Default } = composeStories(stories);

/**
 * Test that ensures the default UIHelloWave renders correctly.
 * It renders the default story and verifies that the wave emoji and wave text with testID are present.
 */
test('renders default UIHelloWave', () => {
	const { getByText } = render(<Default />);
	const waveEmoji = getByText('👋');
	const waveTextId = screen.getByTestId('wave-text');

	expect(waveEmoji).not.toBeNull();
	expect(waveTextId).not.toBeNull();
});
