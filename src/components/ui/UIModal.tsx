/* eslint-disable max-lines */
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
	View,
	TouchableOpacity,
	Image,
	Text,
	Linking,
	BackHandler,
	type NativeSyntheticEvent,
	type NativeScrollEvent,
	type ViewStyle,
	Pressable,
} from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetView, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { icons } from '@/assets/icons';
import { UISvg } from './UISvg';
import { UITitle } from './UITitle';

type Props = {
	readonly isOpen?: boolean;
	readonly href?: string;
	readonly title?: string;
	readonly modalHeaderTitle: string;
	readonly text?: React.ReactNode | string;
	readonly buttonLabel?: string;
	readonly bottomButtonText?: string;
	readonly bottomButtonHref?: string;
	readonly imageSrc?: string;
	readonly children?: React.ReactNode;
	readonly icon?: keyof typeof icons;
	readonly svgIconClassName?: string;
	readonly size?: 'smallToBig' | 'bigToSmall' | 'small' | 'medium' | 'large' | 'full';
	readonly scrollable?: boolean;
	readonly className?: string;
	readonly style?: ViewStyle;
	readonly noHeader?: boolean;
	readonly onClick?: () => void;
	readonly onClose?: () => void;
	readonly bottomButtonOnClick?: () => void;
};

const ModalBody = (props: Props) => {
	return (
		<>
			{props.imageSrc && <Image source={{ uri: props.imageSrc }} className="resize-cover mb-4 h-52 w-full" />}
			{props.icon && (
				<View className="mb-4 items-center justify-center">
					<View className="bg-lightblue rounded-full p-4">
						<UISvg name={props.icon} className={`h-12 w-12 ${props.svgIconClassName}`} />
					</View>
				</View>
			)}
			{props.title && <Text className="my-4 text-center text-xl font-bold">{props.title}</Text>}
			{props.text && <Text className="mb-4 text-base">{props.text}</Text>}
			{props.children}

			{props.href && (
				<TouchableOpacity className="mb-4 text-blue-500 underline" onPress={() => Linking.openURL(props.href ?? '')}>
					<Text>{props.buttonLabel}</Text>
				</TouchableOpacity>
			)}
			{props.onClick && <Pressable onPress={props.onClick}>{props.buttonLabel}</Pressable>}
		</>
	);
};

export const UIModal = (props: Props) => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [headerShadow, setHeaderShadow] = useState(false);

	const snapPoints = useMemo(() => {
		switch (props.size) {
			case 'smallToBig': {
				return ['45%', '91%'];
			}
			case 'bigToSmall': {
				return ['91%', '45%'];
			}
			case 'small': {
				return ['50%'];
			}
			case 'medium': {
				return ['60%'];
			}
			case 'large': {
				return ['80%'];
			}
			case 'full': {
				return ['100%'];
			}
			default: {
				return ['75%'];
			}
		}
	}, [props.size]);

	const handlePresentModal = useCallback(() => {
		if (props.isOpen) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
		}
	}, [props.isOpen]);

	const onDismiss = () => {
		bottomSheetModalRef.current?.dismiss();
		props.onClose?.();
	};

	useEffect(() => {
		handlePresentModal();

		const backHandler = () => {
			if (props.isOpen) {
				props.onClose?.();

				return true;
			}

			return false;
		};

		if (props.isOpen) {
			BackHandler.addEventListener('hardwareBackPress', backHandler);
		}

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backHandler);
		};
	}, [props.isOpen, props.onClose, handlePresentModal]);

	const CustomBackdrop: React.FC<BottomSheetBackdropProps> = ({ animatedIndex, style }) => {
		const containerAnimatedStyle = useAnimatedStyle(() => ({
			opacity: interpolate(
				animatedIndex.value,
				[-1, 0],
				[0, 0.5], // * Adjust the second value to control max opacity
				Extrapolation.CLAMP,
			),
		}));

		const containerStyle = useMemo(
			() => [
				style,
				{
					backgroundColor: '#000000',
				},
				containerAnimatedStyle,
			],
			[style, containerAnimatedStyle],
		);

		return (
			<Animated.View style={containerStyle}>
				<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => bottomSheetModalRef.current?.dismiss()} />
			</Animated.View>
		);
	};

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = event.nativeEvent.contentOffset.y;

		setHeaderShadow(offsetY > 5);
	};

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			index={0}
			enableOverDrag={false}
			snapPoints={snapPoints}
			enablePanDownToClose
			stackBehavior="push"
			handleComponent={props.noHeader ? null : undefined}
			backdropComponent={(props) => <CustomBackdrop {...props} />}
			onDismiss={onDismiss}
		>
			{!props.noHeader && (
				<View className={`flex-row items-center justify-between px-3 pb-4 ${headerShadow ? 'shadow' : ''} bg-white`}>
					<Text className="mr-2 flex-1 flex-shrink">
						<UITitle size="small">{props.modalHeaderTitle}</UITitle>
					</Text>
					<TouchableOpacity className="rounded-full bg-gray-300 p-2" onPress={() => bottomSheetModalRef.current?.dismiss()}>
						<UISvg name="close" className="h-3 w-3 fill-purpleText" />
					</TouchableOpacity>
				</View>
			)}
			{props.scrollable === false ? (
				<BottomSheetView className={props.className} style={[{ padding: 12 }, props.style]}>
					<ModalBody {...props} />
				</BottomSheetView>
			) : (
				<BottomSheetScrollView
					contentContainerStyle={{ display: 'flex', alignItems: 'center' }}
					className={props.className}
					style={props.style}
					onScroll={handleScroll}
				>
					<ModalBody {...props} />
				</BottomSheetScrollView>
			)}

			<View className="mt-2">
				{props.bottomButtonText && props.bottomButtonHref && (
					<TouchableOpacity
						className="mb-2 rounded-lg bg-blue-500 p-4 text-center text-white"
						onPress={() => Linking.openURL(props.bottomButtonHref ?? '')}
					>
						<Text>{props.bottomButtonText}</Text>
					</TouchableOpacity>
				)}
				{props.bottomButtonText && props.bottomButtonOnClick && (
					<TouchableOpacity className="mb-2 rounded-lg bg-blue-500 p-4 text-center text-white" onPress={props.bottomButtonOnClick}>
						<Text>{props.bottomButtonText}</Text>
					</TouchableOpacity>
				)}
			</View>
		</BottomSheetModal>
	);
};
