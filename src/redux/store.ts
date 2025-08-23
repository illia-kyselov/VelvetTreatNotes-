import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tastingsReducer from './tastingsSlice';
import favoritesReducer from './favoritesSlice';
import tryWantReducer from './tryWantSlice';
import collectionsReducer from './collectionsSlice';
import scoresReducer from './scoresSlice'; 

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';


const rootReducer = combineReducers({
  tastings: tastingsReducer,
  favorites: favoritesReducer,
  tryWant: tryWantReducer,
  collections: collectionsReducer,
  scores: scoresReducer, 
});


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['collections', 'favorites', 'tastings', 'tryWant', 'scores'], 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
