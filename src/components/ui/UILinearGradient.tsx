import React from 'react';
import type { ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
	readonly gradientColors: string[];
	readonly children?: React.ReactNode;
	readonly className?: string;
	readonly style?: ViewProps['style'];
};

export const UILinearGradient: React.FC<Props> = ({ children, style, className, gradientColors }) => {
	return (
		<LinearGradient className={className} colors={gradientColors} style={style}>
			{children}
		</LinearGradient>
	);
};
