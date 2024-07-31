import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UIHelloWave } from '@/ui/UIHelloWave';

const UIHelloWaveMeta: Meta<typeof UIHelloWave> = {
	title: 'UIHelloWave',
	component: UIHelloWave,
	decorators: [
		(Story) => (
			<View className="flex h-full w-40 justify-center self-center p-4">
				<Story />
			</View>
		),
	],
};

export default UIHelloWaveMeta;

export const Default: StoryObj<typeof UIHelloWave> = {};
