import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { UILinearGradient } from '@/ui/UILinearGradient';
import { useBooksStore } from '@/lib/store/useBooksStore';

const ShuffleScreen = () => {
	const { booksList } = useBooksStore();
	const [isShuffle, setIsShuffle] = useState(false);
	const [shuffleBookIndex, setShuffleBookIndex] = useState(0);

	const onShuffle = () => {
		setIsShuffle((prev) => !prev);

		// Shuffle the books by chaning the index for 5 seconds eevery 1 second
		const interval = setInterval(() => {
			setShuffleBookIndex(() => {
				const randomIndex = Math.floor(Math.random() * booksList.length);

				return randomIndex;
			});
		}, 100);

		setTimeout(() => {
			clearInterval(interval);
			// setIsShuffle(false);
		}, 5000);

		return () => clearInterval(interval);
	};

	return (
		<View className="flex h-full flex-1 items-center justify-center border-4">
			{isShuffle ? (
				<Image source={{ uri: booksList[shuffleBookIndex]?.bookCoverUrl }} style={{ width: 210, height: 270 }} />
			) : (
				<TouchableOpacity onPress={onShuffle}>
					<UILinearGradient varient="gradientGreenBlue" className="rounded-full p-4">
						<Text className="text-3xl">Shuffle</Text>
					</UILinearGradient>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default ShuffleScreen;
