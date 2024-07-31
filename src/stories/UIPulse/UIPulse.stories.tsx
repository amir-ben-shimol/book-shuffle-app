import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UIPulse } from '@/ui/UIPulse';

const UIPulseMeta: Meta<typeof UIPulse> = {
	title: 'UIPulse',
	component: UIPulse,
	argTypes: {},
	args: {
		color: 'blue',
		diameter: 400,
		duration: 1000,
		initialDiameter: 0,
		numPulses: 3,
		speed: 10,
	},
	decorators: [
		(Story) => (
			<View className="flex h-full w-full items-center justify-center">
				<Story />
			</View>
		),
	],
};

export default UIPulseMeta;

export const Default: StoryObj<typeof UIPulse> = {};

export const CustomColor: StoryObj<typeof UIPulse> = {
	args: {
		color: 'red',
	},
};

export const FastSpeed: StoryObj<typeof UIPulse> = {
	args: {
		speed: 5,
	},
};
