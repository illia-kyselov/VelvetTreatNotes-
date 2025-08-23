import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Tasting = {
  id: string;
  title: string;        
  date: string;         
  place?: string;
  impression?: string;
  tags?: string[];
  liked?: boolean;
  notMyTaste?: boolean;
  photoUri?: string | null;
  createdAt: string;    
};

type TastingsState = { items: Tasting[] };
const initialState: TastingsState = { items: [] };

const tastingsSlice = createSlice({
  name: 'tastings',
  initialState,
  reducers: {
    addTasting: (state, { payload }: PayloadAction<Tasting>) => {
      
      state.items.unshift(payload);
    },
    updateTasting: (state, { payload }: PayloadAction<Tasting>) => {
      const idx = state.items.findIndex(t => t.id === payload.id);
      if (idx !== -1) state.items[idx] = payload;
    },
    clearTastings: (state) => {
      state.items = [];
    },
  },
});

export const { addTasting, updateTasting, clearTastings } = tastingsSlice.actions;
export default tastingsSlice.reducer;


export const selectTastings = (s: { tastings: TastingsState }) => s.tastings.items;

export const selectTastingById =
  (id: string) => (s: { tastings: TastingsState }) =>
    s.tastings.items.find(t => t.id === id) || undefined;


export const selectTastingSections = (s: { tastings: TastingsState }) => {
  const items = [...s.tastings.items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const now = new Date();
  const ymKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = (y: number, m: number) => {
    const thisKey = now.getFullYear() * 12 + now.getMonth();
    const groupKey = y * 12 + (m - 1);
    if (groupKey === thisKey) return 'This Month';
    if (groupKey === thisKey - 1) return 'Last Month';
    return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long' });
  };

  const groups = new Map<string, Tasting[]>();
  for (const t of items) {
    const d = new Date(t.date);
    const key = ymKey(d);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, data]) => {
      const [y, m] = key.split('-').map(Number);
      return { title: monthLabel(y, m), data };
    });
};
