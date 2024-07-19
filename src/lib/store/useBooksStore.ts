import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Book, Filters, FilterTabs } from '../types/ui/book';

type State = {
	booksList: Book[];
	filterBooksQuery: string;
	selectedFilterTab: FilterTabs;
	selectedBook: Book | null;
	allBooksFilters: Filters;
};

type Actions = {
	setBooksList: (books: Book[]) => void;
	setFilterBooksQuery: (query: string) => void;
	setFilterTab: (tab: FilterTabs) => void;
	onAddBook: (book: Book) => void;
	onUpdateBook: (book: Book) => void;
	onRemoveBook: (bookId: number) => void;
	setSelectedBook: (book: Book | null) => void;
	setAllBooksFilters: (filters: Filters) => void;
	resetAllBooksFilters: () => void;
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
			allBooksFilters: {
				yearStart: '',
				yearEnd: '2024',
				minimumRating: 0,
				maxNumberOfPages: 'all',
			},
			setBooksList: (books) => {
				//ensure that it delete all books before adding new ones
				set(() => ({
					booksList: [],
				}));

				set(() => ({
					booksList: books,
				}));
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
			onUpdateBook: (book) => {
				set((state) => ({
					booksList: state.booksList.map((b) => (b.bookId === book.bookId ? book : b)),
				}));
			},
			onRemoveBook: (bookId) => {
				set((state) => ({
					booksList: state.booksList.filter((book) => book.bookId !== bookId),
				}));
			},
			setSelectedBook: (book) => {
				set({
					selectedBook: book,
				});
			},
			setAllBooksFilters: (filters) => {
				set({
					allBooksFilters: filters,
				});
			},
			resetAllBooksFilters: () => {
				set({
					allBooksFilters: {
						minimumRating: 0,
						maxNumberOfPages: 'all',
					},
				});
			},
			resetStore: () => {
				set({
					booksList: [],
					filterBooksQuery: '',
					selectedFilterTab: 'all',
					selectedBook: null,
					allBooksFilters: {
						minimumRating: 0,
						maxNumberOfPages: 'all',
					},
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
