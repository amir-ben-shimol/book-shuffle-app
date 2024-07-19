import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useBooksStore } from '@/lib/store/useBooksStore';
import { UIRating } from './UIRating';

type Props = {
	readonly isVisible: boolean;
	readonly onClose: () => void;
};

export const UIFilter = (props: Props) => {
	const { allBooksFilters, setAllBooksFilters, resetAllBooksFilters } = useBooksStore();
	const [yearStart, setYearStart] = useState(allBooksFilters.yearStart);
	const [yearEnd, setYearEnd] = useState(allBooksFilters.yearEnd);
	const [minimumRating, setMinimumRating] = useState(allBooksFilters.minimumRating);

	useEffect(() => {
		setYearStart(allBooksFilters.yearStart);
		setYearEnd(allBooksFilters.yearEnd);
		setMinimumRating(allBooksFilters.minimumRating);
	}, [allBooksFilters, props.isVisible]);

	const onSetMinimumRating = (rating: number) => {
		setMinimumRating(rating);
	};

	const handleApplyFilter = () => {
		setAllBooksFilters({ yearStart, yearEnd, minimumRating });
		props.onClose();
	};

	const handleResetFilters = () => {
		resetAllBooksFilters();
	};

	return (
		<View className="flex-1">
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
						<Text className="mb-2">Year Published</Text>
						<View className="flex flex-row justify-between">
							<Picker selectedValue={yearStart} style={{ flex: 1 }} onValueChange={(itemValue) => setYearStart(itemValue)}>
								{Array.from({ length: 25 }, (_, i) => 2000 + i).map((year) => (
									<Picker.Item key={year} label={`${year}`} value={`${year}`} />
								))}
							</Picker>
							<Picker selectedValue={yearEnd} style={{ flex: 1 }} onValueChange={(itemValue) => setYearEnd(itemValue)}>
								{Array.from({ length: 25 }, (_, i) => 2000 + i).map((year) => (
									<Picker.Item key={year} label={`${year}`} value={`${year}`} />
								))}
							</Picker>
						</View>
					</View>
					<View className="mb-4">
						<Text className="mb-2">Minimum rating</Text>
						<UIRating rating={minimumRating} showRating imageSize={45} onChange={onSetMinimumRating} />
					</View>
					<Button title="Apply Filters" onPress={handleApplyFilter} />
					<Button title="Reset Filters" onPress={handleResetFilters} />
				</View>
			</Modal>
		</View>
	);
};
