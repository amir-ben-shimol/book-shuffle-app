import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Slot } from 'expo-router';
import { View, FlatList, RefreshControl, type ListRenderItem } from 'react-native';
import * as Haptics from 'expo-haptics';

type PageProps = {
	className?: string;
	header?: boolean;
	onRefresh?: () => void;
};

type ComponentItem = {
	key: string;
	component: React.JSX.Element;
};

const BaseLayout: React.FC<PageProps> = ({ className = '', header = true, onRefresh }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [key, setKey] = useState(0);
	const flatListRef = useRef<FlatList>(null);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

		if (onRefresh) {
			onRefresh();
		}

		setTimeout(() => setKey((prevKey) => prevKey + 1), 2100); // To force the FlatList to re-render, settimeout to let the refresh control finish
	}, [onRefresh]);

	useEffect(() => {
		if (!refreshing) return;

		const timeoutId = setTimeout(() => setRefreshing(false), 2000);

		return () => clearTimeout(timeoutId);
	}, [refreshing]);

	const sections = [
		{
			key: 'app-slot',
			component: (
				<Slot
					screenOptions={{
						headerShown: header,
						animation: 'fade',
						animationEffect: 'fade',
						animationDuration: 300,
						animationEasing: 'ease-in-out',
						scrollEnabled: true,
					}}
				/>
			),
		},
	];

	const renderItem: ListRenderItem<ComponentItem> = ({ item }) => <View className="flex h-full flex-1 flex-col px-2">{item.component}</View>;

	return (
		<FlatList
			key={key}
			ref={flatListRef}
			data={sections}
			renderItem={renderItem}
			keyExtractor={(item) => item.key}
			refreshControl={<RefreshControl refreshing={refreshing} tintColor="#cc4d80" progressViewOffset={40} onRefresh={handleRefresh} />}
			scrollEventThrottle={16}
			className={`mt-14 flex-1 ${className}`}
		/>
	);
};

export default BaseLayout;
