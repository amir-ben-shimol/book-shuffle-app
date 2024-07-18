import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Rating } from 'react-native-ratings';

type Props = {
	readonly className?: string;
	readonly rating: number;
	readonly tintColor?: string;
	readonly style?: ViewStyle;
};

export const UIRating = (props: Props) => {
	return (
		<View className={`flex flex-row items-center ${props.className}`} style={props.style}>
			<Rating
				tintColor={props.tintColor}
				type="star"
				startingValue={props.rating}
				readonly
				imageSize={30}
				fractions={2}
				style={{ paddingVertical: 10 }}
			/>
			<Text className="ml-4 text-lg font-semibold text-gray-600">{props.rating.toFixed(2)}</Text>
		</View>
	);
};
