import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { debounce } from '@/lib/utils/debounce';

type Props = {
	readonly debounceDelay?: number;
	readonly debounceCallback?: (text: string) => void;
} & TextInputProps;

export const UIInput = React.memo((props: Props) => {
	const [value, setValue] = useState('');
	const [isFocused, setIsFocused] = useState(false);

	const debouncedCallback = useCallback(
		debounce((inputText: string) => {
			if (props.debounceCallback) {
				props.debounceCallback(inputText);
			}
		}, props.debounceDelay ?? 500),
		[props.debounceCallback, props.debounceDelay],
	);

	useEffect(() => {
		return () => {
			debouncedCallback.cancel();
		};
	}, [debouncedCallback]);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const onClear = () => {
		props.onChangeText && props.onChangeText('');
	};

	const handleChangeText = (inputText: string) => {
		setValue(inputText);
		debouncedCallback(inputText);
		props.onChangeText && props.onChangeText(inputText);
	};

	return (
		<View className={`mb-4 flex flex-row items-center rounded border bg-gray-200 px-2 py-2 ${isFocused ? 'border-blue-500' : 'border-gray-200'}`}>
			<Icon name="search" color="gray" size={24} />
			<TextInput
				className="ml-2 flex-1 text-start"
				placeholderTextColor="gray"
				value={value}
				autoFocus={props.autoFocus}
				placeholder={props.placeholder}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChangeText={handleChangeText}
			/>
			{props.value && props.value.length > 0 && (
				<Pressable onPress={onClear}>
					<Icon name="cancel" color="gray" size={18} />
				</Pressable>
			)}
		</View>
	);
});
