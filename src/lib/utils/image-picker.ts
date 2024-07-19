import * as ImagePicker from 'expo-image-picker';

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
