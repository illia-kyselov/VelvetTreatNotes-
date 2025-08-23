import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FavoritesState = {
  items: string[];        
};

const initialState: FavoritesState = { items: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const i = state.items.indexOf(id);
      if (i >= 0) state.items.splice(i, 1);
      else state.items.push(id);
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.items.includes(id)) state.items.push(id);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter(x => x !== id);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;


export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.items;

export const selectIsFavorite =
  (id: string) => (state: { favorites: FavoritesState }) =>
    state.favorites.items.includes(id);

export default favoritesSlice.reducer;
