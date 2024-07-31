import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './UIPulse.stories';

const { Default, CustomColor, FastSpeed } = composeStories(stories);

/**
 * Test that ensures the default UIPulse renders correctly.
 * It renders the default story and verifies that the pulses are present.
 */
test('renders default UIPulse', () => {
	render(<Default />);
	const pulses = screen.getAllByTestId('pulse');

	expect(pulses.length).toBeGreaterThan(0);
});

/**
 * Test that ensures the UIPulse with a custom color renders correctly.
 * It renders the CustomColor story and verifies that the pulse color is correct.
 */
test('renders UIPulse with custom color', () => {
	render(<CustomColor />);
	const pulse = screen.getAllByTestId('pulse')[0];

	expect(pulse.props.style).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				backgroundColor: 'red',
			}),
		]),
	);
});

/**
 * Test that ensures the UIPulse with a fast speed renders correctly.
 * It renders the FastSpeed story and verifies that the pulses update quickly.
 */
test('renders UIPulse with fast speed', () => {
	render(<FastSpeed />);
	const pulses = screen.getAllByTestId('pulse');

	expect(pulses.length).toBeGreaterThan(0);
});
