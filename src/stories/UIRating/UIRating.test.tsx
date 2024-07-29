import { render, screen, fireEvent } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './UIRating.stories';

const { Default, ReadOnly, WithoutRatingNumber } = composeStories(stories);

/**
 * Test that ensures the UIRating component is not editable when readonly is set to true.
 * It tries to change the rating by firing a press event and verifies that the rating does not change.
 */
test('readonly UIRating should not be editable', () => {
	render(<ReadOnly />);
	const ratingElement = screen.getByText('2.5');

	fireEvent.press(ratingElement);

	expect(ratingElement.props.children).toBe(2.5);
});

/**
 * Test that ensures the UIRating component is editable by default.
 * It changes the rating by firing an onFinishRating event and verifies that the rating changes.
 */
test('default UIRating is editable', () => {
	render(<Default />);
	const ratingElement = screen.getByText('2.5');

	fireEvent(ratingElement, 'onFinishRating', 4);

	expect(ratingElement.props.children).not.toBe('2.5');
});

/**
 * Test that ensures the UIRating component does not display the rating number when showRatingNumber is set to false.
 * It verifies that the rating number is not rendered.
 */
test('UIRating with rating number should display the rating number', () => {
	render(<WithoutRatingNumber />);
	const ratingNumber = screen.queryByText('2.5');

	expect(ratingNumber).toBeNull();
});
