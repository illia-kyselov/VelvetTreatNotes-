import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Status = { tried: boolean; want: boolean };
type TryWantState = {
  byId: Record<string, Status>; 
};

const initialState: TryWantState = { byId: {} };

type SetPayload = { id: string; value: boolean };

const tryWantSlice = createSlice({
  name: 'tryWant',
  initialState,
  reducers: {
    setTried(state, action: PayloadAction<SetPayload>) {
      const { id, value } = action.payload;
      const prev = state.byId[id] || { tried: false, want: false };
      
      state.byId[id] = { tried: value, want: value ? false : prev.want };
    },
    setWant(state, action: PayloadAction<SetPayload>) {
      const { id, value } = action.payload;
      const prev = state.byId[id] || { tried: false, want: false };
      
      state.byId[id] = { tried: value ? false : prev.tried, want: value };
    },
    clearTryWant(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
    },
    clearAll(state) {
      state.byId = {};
    },
  },
});

export const { setTried, setWant, clearTryWant, clearAll } = tryWantSlice.actions;


export const selectTryWant =
  (id: string) =>
  (state: { tryWant: TryWantState }): Status =>
    state.tryWant.byId[id] || { tried: false, want: false };

export default tryWantSlice.reducer;
