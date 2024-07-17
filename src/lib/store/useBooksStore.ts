import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Book, FilterTabs } from '../types/ui/book';

type State = {
	booksList: Book[];
	filterBooksQuery: string;
	selectedFilterTab: FilterTabs;
	selectedBook: Book | null;
};

type Actions = {
	setBooksList: (books: Book[]) => void;
	setFilterBooksQuery: (query: string) => void;
	setFilterTab: (tab: FilterTabs) => void;
	onAddBook: (book: Book) => void;
	setSelectedBook: (book: Book | null) => void;
	resetStore: () => void;
};

type BooksStore = State & Actions;

const useBooksStore = create<BooksStore>()(
	persist(
		(set) => ({
			booksList: [],
			filterBooksQuery: '',
			selectedFilterTab: 'all',
			selectedBook: null,
			setBooksList: (books) => {
				set({
					booksList: books,
				});
			},
			setFilterBooksQuery: (query) => {
				set({
					filterBooksQuery: query,
				});
			},

			setFilterTab: (tab) => {
				set({
					selectedFilterTab: tab,
				});
			},
			onAddBook: (book) => {
				set((state) => ({
					booksList: [...state.booksList, book],
				}));
			},
			setSelectedBook: (book) => {
				set({
					selectedBook: book,
				});
			},
			resetStore: () => {
				set({
					booksList: [],
					filterBooksQuery: '',
					selectedFilterTab: 'all',
					selectedBook: null,
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
