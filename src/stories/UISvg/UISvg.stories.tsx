import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UISvg } from '@/ui/UISvg';

const UISvgMeta: Meta<typeof UISvg> = {
	title: 'UISvg',
	component: UISvg,
	argTypes: {
		onClick: { action: 'clicked' },
	},
	args: {
		name: 'heart',
		fill: 'black',
		stroke: 'none',
		strokeWidth: 1,
	},
	decorators: [
		(Story) => (
			<View className="flex h-full w-full items-center justify-center">
				<Story />
			</View>
		),
	],
};

export default UISvgMeta;

export const Default: StoryObj<typeof UISvg> = {};

export const WithFill: StoryObj<typeof UISvg> = {
	args: {
		fill: 'blue',
	},
};

export const WithStroke: StoryObj<typeof UISvg> = {
	args: {
		stroke: 'red',
		strokeWidth: 2,
	},
};

export const Clickable: StoryObj<typeof UISvg> = {
	args: {
		onClick: () => {
			console.log('Icon clicked');
		},
	},
};
