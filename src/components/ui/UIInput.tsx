import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Keyboard, Pressable, TextInput, type TextInputProps, Text } from 'react-native';
import { debounce } from '@/lib/utils/debounce';

type Props = {
	readonly label?: string;
	readonly debounceDelay?: number;
	readonly icon?: string;
	readonly value?: string;
	readonly showClearButton?: boolean;
	readonly showCancelButton?: boolean;
	readonly onFocus?: VoidFunction;
	readonly onBlur?: VoidFunction;
	readonly debounceCallback?: (text: string) => void;
	readonly onClear?: VoidFunction;
} & TextInputProps;

export const UIInput = React.memo((props: Props) => {
	const [value, setValue] = useState(props.value ?? '');
	const [isFocused, setIsFocused] = useState(false);
	const inputFlex = useSharedValue(1);

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

	useEffect(() => {
		if (!props.showCancelButton) return;

		inputFlex.value = withTiming(isFocused ? 0.98 : 1, {
			duration: 300,
		});
	}, [isFocused, props.showCancelButton]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			flex: inputFlex.value,
		};
	});

	const handleFocus = () => {
		setIsFocused(true);

		if (props.onFocus) {
			props.onFocus();
		}
	};

	const handleBlur = () => {
		setIsFocused(false);
		Keyboard.dismiss();

		if (props.onBlur) {
			props.onBlur();
		}
	};

	const onClear = () => {
		props.onChangeText && props.onChangeText('');
		props.onClear && props.onClear();
		setValue('');
	};

	const handleChangeText = (inputText: string) => {
		setValue(inputText);
		debouncedCallback(inputText);
		props.onChangeText && props.onChangeText(inputText);
	};

	const onCancel = () => {
		onClear();
		handleBlur();
	};

	return (
		<>
			{props.label && <Text className="mb-2">{props.label}</Text>}

			<Animated.View
				className={`flex flex-row items-center rounded border bg-gray-200 px-2 py-2 ${isFocused ? 'border-blue-500' : 'border-gray-200'} ${props.className}`}
				style={props.showCancelButton ? [props.style, animatedStyle] : [props.style]}
			>
				{props.icon && <Icon className="mr-2" name={props.icon} color="gray" size={24} />}
				<TextInput
					className="flex-1 text-start"
					placeholderTextColor="gray"
					value={value}
					autoFocus={props.autoFocus}
					placeholder={props.placeholder}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onChangeText={handleChangeText}
				/>
				{value.length > 0 && props.showClearButton && (
					<Pressable onPress={onClear}>
						<Icon name="cancel" color="gray" size={18} />
					</Pressable>
				)}
			</Animated.View>

			{isFocused && props.showCancelButton && (
				<Pressable className="ml-2" onPress={onCancel}>
					<Text>Cancel</Text>
				</Pressable>
			)}
		</>
	);
});
