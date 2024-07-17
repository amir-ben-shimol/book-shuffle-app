import React, { useEffect, useState } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomTabsNavigator from '@/layouts/BottomTabsNavigator';
import { convertToBookArray } from '@/lib/utils/book';
import { useBooksStore } from '@/lib/store/useBooksStore';
import jsonData from '../lib/data/books-list-updated.json';

const RootLayout: React.FC = () => {
	const [appIsReady, setAppIsReady] = useState(false);
	const { booksList, setBooksList } = useBooksStore();

	const loadBooks = () => {
		if (booksList.length > 0) return;

		const books = convertToBookArray(jsonData);

		setBooksList(books);
	};

	useEffect(() => {
		const prepare = async () => {
			try {
				SplashScreen.preventAutoHideAsync();

				const bookLoadingPromise = loadBooks();

				const splashTimeoutPromise = new Promise((resolve) => {
					setTimeout(resolve, 2000);
				});

				await Promise.all([bookLoadingPromise, splashTimeoutPromise]);

				setAppIsReady(true);
				await SplashScreen.hideAsync();
			} catch (error) {
				console.warn(error);
			}
		};

		prepare();
	}, []);

	if (!appIsReady) {
		return null;
	}

	return (
		<GestureHandlerRootView className="flex-1 pb-8">
			<BottomSheetModalProvider>
				<BottomTabsNavigator />
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
};

export default RootLayout;
