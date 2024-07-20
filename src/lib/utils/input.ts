import { TextInput } from 'react-native';

export const onBlurActiveInput = () => {
	const currentlyFocusedInput = TextInput.State.currentlyFocusedInput();

	if (currentlyFocusedInput) {
		TextInput.State.blurTextInput(currentlyFocusedInput);
	}
};
