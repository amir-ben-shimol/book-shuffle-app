import React from 'react';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { UINotifications } from '@/ui/UINotifications';

type Props = {
	readonly className?: string;
};

const BaseLayout = (props: Props) => {
	return (
		<View className={`mt-14 flex-1 ${props.className}`}>
			<View className="flex h-full flex-1 flex-col px-4">
				<UINotifications />

				<Slot />
			</View>
		</View>
	);
};

export default BaseLayout;
