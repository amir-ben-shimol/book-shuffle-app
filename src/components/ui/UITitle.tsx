import React from 'react';
import { Text, type ViewStyle } from 'react-native';

type Props = {
	readonly children: string;
	readonly varient?: 'white' | 'gradientRedPurple' | 'gradientGreenBlue' | 'gradientPinkPurple' | 'dark' | 'blue';
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly size?: 'small' | 'medium' | 'large';
};

export const UITitle = (props: Props) => {
	const textFontSize = props.size === 'small' ? 'text-lg' : props.size === 'medium' ? 'text-xl' : props.size === 'large' ? 'text-2xl' : 'text-2xl';

	return (
		<Text style={props.style} className={`${textFontSize} font-bold text-blue-500 ${props.className}`}>
			{props.children}
		</Text>
	);
};
