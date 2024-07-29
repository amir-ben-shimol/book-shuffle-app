import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UITitle } from '@/ui/UITitle';

const UITitleMeta: Meta<typeof UITitle> = {
	title: 'UITitle',
	component: UITitle,
	argTypes: {
		varient: {
			control: {
				type: 'select',
			},
		},
		size: {
			control: {
				type: 'select',
				options: ['small', 'medium', 'large'],
			},
		},
	},
	args: {
		children: 'This is a title',
		varient: 'blue',
		size: 'large',
	},
	decorators: [
		(Story) => (
			<View className="flex h-full items-start justify-center p-2">
				<Story />
			</View>
		),
	],
};

export default UITitleMeta;

export const Default: StoryObj<typeof UITitle> = {};

export const SmallTitle: StoryObj<typeof UITitle> = {
	args: {
		size: 'small',
		children: 'This is a small title',
	},
};

export const MediumTitle: StoryObj<typeof UITitle> = {
	args: {
		size: 'medium',
		children: 'This is a medium title',
	},
};

export const LargeTitle: StoryObj<typeof UITitle> = {
	args: {
		size: 'large',
		children: 'This is a large title',
	},
};
