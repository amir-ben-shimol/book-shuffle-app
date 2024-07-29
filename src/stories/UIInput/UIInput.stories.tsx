/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { UIInput } from '@/ui/UIInput';

const UIInputMeta: Meta<typeof UIInput> = {
	title: 'UIInput',
	component: UIInput,
	argTypes: {
		onActivate: { action: 'activated' },
		onDeactivate: { action: 'deactivated' },
		debounceCallback: { action: 'debounced' },
		onClear: { action: 'cleared' },
	},
	args: {
		placeholder: 'Search for books',
		className: 'text-start',
		placeholderTextColor: 'gray',
		showClearButton: false,
		debounceDelay: 300,
	},
	decorators: [
		(Story) => (
			<View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
				<Story />
			</View>
		),
	],
};

export default UIInputMeta;

export const Default: StoryObj<typeof UIInput> = {};

export const WithLabel: StoryObj<typeof UIInput> = {
	args: {
		label: 'First Name',
		placeholder: 'Enter your first name',
	},
};

export const WithIcon: StoryObj<typeof UIInput> = {
	args: {
		icon: 'search',
	},
};

export const WithCancelButton: StoryObj<typeof UIInput> = {
	render: (args) => {
		const [isActive, setIsActive] = useState(false);

		const handleActivate = () => {
			setIsActive(true);
			args.onActivate?.();
		};

		const handleDeactivate = () => {
			setIsActive(false);
			args.onDeactivate?.();
		};

		return <UIInput {...args} isActive={isActive} onActivate={handleActivate} onDeactivate={handleDeactivate} />;
	},
	args: {
		showClearButton: true,
		showCancelButton: true,
	},
};
