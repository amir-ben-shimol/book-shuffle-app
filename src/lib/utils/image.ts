import * as ImagePicker from 'expo-image-picker';
import ImageColors from 'react-native-image-colors';

export const launchImagePicker = async () => {
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: [1, 1],
		quality: 1,
	});

	if (!result.canceled && result.assets[0]) {
		return result.assets[0].uri;
	}

	return null;
};

export const getImageDominantColor = async (uri: string) => {
	try {
		const result = await ImageColors.getColors(uri, {
			cache: true,
			key: uri,
		});

		if (result.platform === 'android') {
			return [result.dominant, result.average, result.vibrant];
		} else if (result.platform === 'ios') {
			return [result.primary, result.secondary, result.background];
		} else {
			throw new Error('Unexpected platform key');
		}
	} catch (error) {
		console.error('Error fetching image colors:', error);

		return [];
	}
};
