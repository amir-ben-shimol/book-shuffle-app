import React from 'react';
import { View } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react';
import { UIModal } from '@/ui/UIModal';

const UIModalMeta: Meta<typeof UIModal> = {
	title: 'UIModal',
	component: UIModal,
	argTypes: {
		onClick: { action: 'button clicked' },
		onClose: { action: 'modal closed' },
		bottomButtonOnClick: { action: 'bottom button clicked' },
	},
	args: {
		modalHeaderTitle: 'Modal Header',
	},
	decorators: [
		(Story) => (
			<BottomSheetModalProvider>
				<View className="flex h-full w-full justify-center self-center p-4">
					<Story />
				</View>
			</BottomSheetModalProvider>
		),
	],
};

export default UIModalMeta;

export const Default: StoryObj<typeof UIModal> = {
	args: {
		isOpen: true,
		text: 'This is a modal',
	},
};

export const WithImage: StoryObj<typeof UIModal> = {
	args: {
		isOpen: true,
		text: 'This is a modal with an image',
		imageSrc: 'https://via.placeholder.com/150',
	},
};

export const WithIcon: StoryObj<typeof UIModal> = {
	args: {
		isOpen: true,
		text: 'This is a modal with an icon',
		icon: 'heart',
	},
};

export const WithBottomButton: StoryObj<typeof UIModal> = {
	args: {
		isOpen: true,
		text: 'This is a modal with a bottom button',
		bottomButtonText: 'Click me',
		bottomButtonOnClick: () => console.log('Bottom button clicked'),
	},
};
