import React from 'react';
import type { ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/styles/colors.cjs';

type Props = {
	readonly varient:
		| 'gradientGreenBlue'
		| 'gradientPinkPurple'
		| 'gradientRedPurple'
		| 'borderOnlyGradientPinkPurple'
		| 'whiteAndShadow'
		| 'whiteLightBlueBorder'
		| 'whitePurpleBorder'
		| 'buttonTextRed'
		| 'white'
		| 'buttonTextBlack'
		| 'darkGray';
	readonly children?: React.ReactNode;
	readonly className?: string;
	readonly style?: ViewProps['style'];
};

const backgroundColors = {
	gradientGreenBlue: [`rgb(${colors.greenPrimary})`, `rgb(${colors.bluePrimary})`],
	gradientPinkPurple: [`rgb(${colors.pinkPrimary})`, `rgb(${colors.purplePrimary})`],
	gradientRedPurple: [`rgb(${colors.pinkPrimary})`, `rgb(${colors.purplePrimary})`],
	borderOnlyGradientPinkPurple: ['rgb(255, 255, 255)'],
	whiteAndShadow: ['rgb(255, 255, 255)'],
	buttonTextRed: ['transparent'],
	whitePurpleBorder: ['transparent'],
	buttonTextBlack: ['transparent'],
	darkGray: [`rgb(${colors.grayPrimary})`],
	white: [`rgb(${colors.white})`],
	whiteLightBlueBorder: ['transparent'],
};

export const UILinearGradient: React.FC<Props> = ({ varient, children, style, className }) => {
	const gradientColors = backgroundColors[varient];

	return (
		<LinearGradient className={className} colors={gradientColors} style={style}>
			{children}
		</LinearGradient>
	);
};
