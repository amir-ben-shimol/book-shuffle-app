/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { View, type ViewStyle, Text } from 'react-native';
import { Rating, type RatingProps } from 'react-native-ratings';

type Props = {
	readonly className?: string;
	readonly rating?: number;
	readonly tintColor?: string;
	readonly readonly?: boolean;
	readonly style?: ViewStyle;
	readonly showRating?: boolean;
	readonly showRatingNumber?: boolean;
	readonly imageSize?: number;
	readonly onChange?: (rating: number) => void;
};

export const UIRating = React.memo((props: Props) => {
	const [currentRating, setCurrentRating] = useState(2.5);

	const onChangeRating = (rating: number) => {
		if (props.onChange !== undefined && !props.readonly) {
			props.onChange(rating);
		}

		setCurrentRating(rating);
	};

	// Done it due to issue with latest version 8.1.0 of react-native-ratings
	const ratingProps = {
		tintColor: props.tintColor,
		type: 'star',
		startingValue: props.rating ?? currentRating,
		showRating: props.showRating,
		showReadOnlyText: false,
		imageSize: props.imageSize ?? 30,
		fractions: 2,
		style: { paddingVertical: 10 } as any,
		readonly: props.readonly,
		onFinishRating: onChangeRating,
	} as RatingProps;

	return (
		<View className={`flex flex-row items-center ${props.readonly ? 'justify-start' : 'justify-center'} ${props.className}`} style={props.style}>
			<Rating {...ratingProps} />
			{props.showRatingNumber && <Text className="text-l ml-1 font-semibold text-yellow-400">{props.rating}</Text>}
		</View>
	);
});
