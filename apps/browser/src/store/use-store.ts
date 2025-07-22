import { create, type Mutate, type StateCreator, type StoreApi } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LoginOutput } from '@chatally/api';

const zustandStorageName = 'zustand-storage';
const storeVersion = 2; // Increment this when making breaking changes to the store

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type StoreWithPersist = Mutate<
  // @ts-expect-error: StateCreator expects an array of arguments
  StoreApi<StateCreator>,
  [['zustand/persist', unknown]]
>;

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      // console.log('storage event', e);
      store.persist.rehydrate();
    }
  };

  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};

type Values = {
  isDarkMode: boolean;
  isRtl: boolean;
  authState:
    | {
        status: 'LoggedOut';
        userId: undefined; // this to help with type narrowing
      }
    | ({ status: 'LoggedIn' } & LoginOutput['data']['info']);
  accessToken?: string;
  refreshToken?: string;
};

type Actions = {
  updateDarkMode: (mode: boolean) => void;
  updateRTL: (mode: boolean) => void;
  updateAuthState: (authState: Values['authState']) => void;
  updateAccessToken: (accessToken?: string) => void;
  updateRefreshToken: (refreshToken?: string) => void;
  logout: () => void;
  reset: () => void;
};

type Store = Values & Actions;

type ZustandLocalSTorage = {
  state: Values;
  version: number;
};

const storageString = localStorage.getItem(zustandStorageName);
const currentStore: ZustandLocalSTorage | null =
  storageString === null ? null : JSON.parse(storageString);
const resetState = {
  isDarkMode: false,
  isRtl: true,
  authState: {
    status: 'LoggedOut',
    userId: undefined,
  },
} satisfies Values;
const initialState: Values = currentStore?.state ?? resetState;
const useStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,
      updateDarkMode: (mode) =>
        set(() => ({
          isDarkMode: mode,
        })),
      updateRTL: (mode) =>
        set(() => ({
          isRtl: mode,
        })),
      updateAuthState: (authState) =>
        set(() => ({
          authState,
        })),
      updateAccessToken: (accessToken) => set(() => ({ accessToken })),
      updateRefreshToken: (refreshToken) => set(() => ({ refreshToken })),
      logout: () =>
        set(() => ({
          authState: {
            status: 'LoggedOut',
            userId: undefined,
          },
        })),
      reset: () =>
        set((state) => ({
          ...resetState,
        })),
    }),
    {
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isRtl: state.isRtl,
        authState: state.authState,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      name: zustandStorageName,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        console.log('hydration starts');
        console.log('state before hydration', state);
        return (state, error) => {
          if (error) {
            console.log(
              'an error happened during hydration',
              error,
              'state:',
              state,
            );
          } else {
            console.log('hydration finished');
          }
        };
      },
      version: storeVersion,
      migrate: (persistedState, version) => {
        // Perform any necessary migrations here
        if (version !== storeVersion) {
          console.log(
            'Migrating store from version',
            version,
            'to',
            storeVersion,
          );
          return resetState; // or your reset state
        }
        return persistedState;
      },
    },
  ),
);

withStorageDOMEvents(useStore);

export { useStore, zustandStorageName, storeVersion };
export type { Store };
