import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/ui/user';

type State = {
	user: User | null;
};

type Actions = {
	setUser: (user: User) => void;
	resetStore: () => void;
};

type UserStore = State & Actions;

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => {
				set({
					user,
				});
			},
			resetStore: () => {
				set({
					user: null,
				});
			},
		}),
		{
			name: 'user-store',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export { useUserStore };
