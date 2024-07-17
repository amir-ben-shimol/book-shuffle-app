import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Book } from '../types/ui/book';

type State = {
	booksList: Book[];
};

type Actions = {
	setBooksList: (books: Book[]) => void;
	resetStore: () => void;
};

type BooksStore = State & Actions;

const useBooksStore = create<BooksStore>()(
	persist(
		(set) => ({
			booksList: [],

			setBooksList: (books) => {
				set({
					booksList: books,
				});
			},

			resetStore: () => {
				set({
					booksList: [],
				});
			},
		}),
		{
			name: 'booksListStore',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export { useBooksStore };
