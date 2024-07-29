import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UIRating } from '@/ui/UIRating';

const UIRatingMeta: Meta<typeof UIRating> = {
	title: 'UIRating',
	component: UIRating,
	argTypes: {
		onChange: { action: 'rating changed' },
	},
	args: {
		rating: 2.5,
		tintColor: '#f5f5f5',
		readonly: false,
		showRating: true,
		showRatingNumber: true,
		imageSize: 30,
	},
	decorators: [
		(Story) => (
			<View className="flex h-full items-center justify-center p-2">
				<Story />
			</View>
		),
	],
};

export default UIRatingMeta;

export const Default: StoryObj<typeof UIRating> = {};

export const ReadOnly: StoryObj<typeof UIRating> = {
	args: {
		readonly: true,
	},
};

export const WithCustomTintColor: StoryObj<typeof UIRating> = {
	args: {
		tintColor: '#e0e0e0',
	},
};

export const WithoutRatingNumber: StoryObj<typeof UIRating> = {
	args: {
		showRatingNumber: false,
	},
};

export const LargeImageSize: StoryObj<typeof UIRating> = {
	args: {
		imageSize: 50,
	},
};
