import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UIHtmlView } from '@/ui/UIHtmlView';

const mockHtml = '<p style="color: white;">This is a <a href="https://example.com">link</a> and a line break.<br/>New line here.</p>';

const UIHtmlViewMeta: Meta<typeof UIHtmlView> = {
	title: 'UIHtmlView',
	component: UIHtmlView,
	args: {
		value: mockHtml,
	},
	decorators: [
		(Story) => (
			<View className="flex h-full w-40 justify-center self-center p-4">
				<Story />
			</View>
		),
	],
};

export default UIHtmlViewMeta;

export const Default: StoryObj<typeof UIHtmlView> = {};
