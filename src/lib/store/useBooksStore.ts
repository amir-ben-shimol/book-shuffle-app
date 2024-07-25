import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationsStore } from '@/lib/store/useNotificationsStore';
import type { Book, Filters, FilterTabs } from '../types/ui/book';

type State = {
	booksList: Book[];
	recentlyViewedBooks: Book[];
	filterBooksQuery: string;
	selectedFilterTab: FilterTabs;
	allBooksFilters: Filters;
};

type Actions = {
	setBooksList: (books: Book[]) => void;
	setFilterBooksQuery: (query: string) => void;
	setFilterTab: (tab: FilterTabs) => void;
	onAddBook: (book: Book) => void;
	onAddRecentlyViewedBook: (book: Book) => void;
	onResetRecentlyViewedBooks: () => void;
	onUpdateBook: (book: Book) => void;
	onRemoveBook: (bookId: number) => void;
	setAllBooksFilters: (filters: Filters) => void;
	resetAllBooksFilters: () => void;
	resetStore: () => void;
};

type BooksStore = State & Actions;

const useBooksStore = create<BooksStore>()(
	persist(
		(set) => ({
			booksList: [],
			recentlyViewedBooks: [],
			filterBooksQuery: '',
			selectedFilterTab: 'all',
			allBooksFilters: {
				yearStart: '',
				yearEnd: '2024',
				minimumRating: 0,
				maxNumberOfPages: 'all',
			},
			setBooksList: (books) => {
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

				const { showNotification } = useNotificationsStore.getState();

				showNotification({
					type: 'success',
					title: 'Book added',
					content: `The book "${book.title}" has been successfully added to your library
					`,
					duration: 5000,
				});
			},
			onAddRecentlyViewedBook: (book) => {
				set((state) => {
					const bookExists = state.recentlyViewedBooks.some((b) => b.bookId === book.bookId);
					let updatedRecentlyViewedBooks = state.recentlyViewedBooks.filter((b) => b.bookId !== book.bookId);

					if (bookExists) {
						updatedRecentlyViewedBooks = [book, ...updatedRecentlyViewedBooks];
					} else {
						updatedRecentlyViewedBooks = [book, ...state.recentlyViewedBooks].slice(0, 15);
					}

					return { recentlyViewedBooks: updatedRecentlyViewedBooks };
				});
			},
			onResetRecentlyViewedBooks: () => {
				set({
					recentlyViewedBooks: [],
				});
			},
			onUpdateBook: (book) => {
				set((state) => ({
					booksList: state.booksList.map((b) => (b.bookId === book.bookId ? book : b)),
				}));
			},
			onRemoveBook: (bookId) => {
				const book = useBooksStore.getState().booksList.find((b) => b.bookId === bookId);

				set((state) => ({
					booksList: state.booksList.filter((book) => book.bookId !== bookId),
				}));

				const { showNotification } = useNotificationsStore.getState();

				showNotification({
					type: 'success',
					title: 'Book removed',
					content: `The book "${book?.title}" has been successfully removed from your library`,
					duration: 5000,
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
					recentlyViewedBooks: [],
					filterBooksQuery: '',
					selectedFilterTab: 'all',
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
