import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { UIRating } from '@/ui/UIRating';
import type { Filters } from '@/lib/types/ui/book';

type BaseProps = {
	readonly isVisible: boolean;
	readonly onClose: () => void;
};

type AllBooksProps = BaseProps & {
	readonly type: 'allBooks';
};

type ShuffleProps = BaseProps & {
	readonly type: 'shuffle';
	readonly filters: Filters;
	readonly onApplyFilters: (filters: Filters) => void;
	readonly onResetFilters: () => void;
};

type Props = AllBooksProps | ShuffleProps;

export const FilterModal = (props: Props) => {
	const { allBooksFilters, setAllBooksFilters, resetAllBooksFilters } = useBooksStore();
	const [minimumRating, setMinimumRating] = useState(allBooksFilters.minimumRating);
	const [maxNumberOfPages, setMaxNumberOfPages] = useState(allBooksFilters.maxNumberOfPages);

	useEffect(() => {
		if (props.type === 'shuffle') {
			setMinimumRating(props.filters.minimumRating);
			setMaxNumberOfPages(props.filters.maxNumberOfPages);
		} else {
			setMinimumRating(allBooksFilters.minimumRating);
			setMaxNumberOfPages(allBooksFilters.maxNumberOfPages);
		}
	}, [allBooksFilters, props.isVisible, props.type]);

	const onSetMinimumRating = (rating: number) => {
		setMinimumRating(rating);
	};

	const handleApplyFilter = () => {
		if (props.type === 'shuffle') {
			props.onApplyFilters({ minimumRating, maxNumberOfPages });
		} else {
			setAllBooksFilters({ minimumRating, maxNumberOfPages });
		}

		props.onClose();
	};

	const handleResetFilters = () => {
		if (props.type === 'shuffle') {
			props.onResetFilters();
		} else {
			resetAllBooksFilters();
		}

		props.onClose();
	};

	return (
		<View className="absolute flex-1">
			<Modal
				isVisible={props.isVisible}
				animationIn="bounceInRight"
				animationOut="bounceOutRight"
				animationInTiming={500}
				animationOutTiming={500}
				hideModalContentWhileAnimating
				onBackdropPress={props.onClose}
			>
				<View className="rounded bg-white p-4">
					<Text className="mb-4 text-lg font-bold">Filter Books</Text>

					<View className="mb-4">
						<Text className="mb-2">Minimum rating</Text>
						<UIRating rating={minimumRating} showRating imageSize={45} onChange={onSetMinimumRating} />
					</View>

					<View className="mb-4">
						<Text className="-mb-4">Max Number of Pages</Text>
						<Picker selectedValue={maxNumberOfPages} onValueChange={(itemValue) => setMaxNumberOfPages(itemValue)}>
							<Picker.Item label="All" value="all" />
							<Picker.Item label="0-200" value="up-to-200" />
							<Picker.Item label="200-400" value="200-400" />
							<Picker.Item label="400-500" value="400-500" />
							<Picker.Item label="500-600" value="500-600" />
							<Picker.Item label="600-800" value="600-800" />
							<Picker.Item label="800+" value="800+" />
						</Picker>
					</View>

					<View className="flex w-full flex-row items-center justify-between">
						<TouchableOpacity className="rounded bg-gray-400 px-8 py-4" onPress={handleResetFilters}>
							<Text className="font-semibold text-white">Reset</Text>
						</TouchableOpacity>
						<TouchableOpacity className="rounded bg-blue-400 px-8 py-4" onPress={handleApplyFilter}>
							<Text className="font-semibold text-white">Apply</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
};
