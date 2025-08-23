import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface Collection {
  id: string;
  name: string;
  photoUri: string | null;
  createdAt: string; 
}

export interface CollectionSet {
  id: string;
  title: string;
  description?: string;
  imageUri?: string | null;
  createdAt: string; 
}

interface CollectionsState {
  items: Collection[];
  
  setsByCollection: Record<string, CollectionSet[]>;
}

const initialState: CollectionsState = {
  items: [],
  setsByCollection: {}, 
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    
    addCollection: {
      reducer(state, action: PayloadAction<Collection>) {
        state.items.push(action.payload);
      },
      prepare(input: { name?: string; photoUri?: string | null }) {
        const name = (input.name ?? '').trim();
        return {
          payload: {
            id: nanoid(),
            name: name.length ? name : 'New collection',
            photoUri: input.photoUri ?? null,
            createdAt: new Date().toISOString(),
          } as Collection,
        };
      },
    },
    removeCollection(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((c) => c.id !== id);
      if (state.setsByCollection) delete state.setsByCollection[id];
    },
    clearCollections(state) {
      state.items = [];
      state.setsByCollection = {};
    },

    
    addSetToCollection: {
      prepare({ collectionId, title }: { collectionId: string; title?: string }) {
        const t = (title ?? '').trim() || 'Enter Set Title';
        return {
          payload: {
            collectionId,
            set: {
              id: nanoid(),
              title: t,
              description: '',
              imageUri: null,
              createdAt: new Date().toISOString(),
            } as CollectionSet,
          },
        };
      },
      reducer(state, action: PayloadAction<{ collectionId: string; set: CollectionSet }>) {
        const { collectionId, set } = action.payload;
        if (!state.setsByCollection) state.setsByCollection = {};
        if (!state.setsByCollection[collectionId]) state.setsByCollection[collectionId] = [];
        state.setsByCollection[collectionId].push(set);
      },
    },

    renameSet(
      state,
      action: PayloadAction<{ collectionId: string; setId: string; title: string }>
    ) {
      const { collectionId, setId, title } = action.payload;
      const list = (state.setsByCollection ?? {})[collectionId] || [];
      const found = list.find((s) => s.id === setId);
      if (found) found.title = title.trim() || 'Enter Set Title';
    },

    
    updateSetInCollection(
      state,
      action: PayloadAction<{
        collectionId: string;
        setId: string;
        changes: Partial<Pick<CollectionSet, 'title' | 'description' | 'imageUri'>>;
      }>
    ) {
      const { collectionId, setId, changes } = action.payload;
      if (!state.setsByCollection) state.setsByCollection = {};
      const list = state.setsByCollection[collectionId] || [];
      const found = list.find((s) => s.id === setId);
      if (!found) return;

      if (typeof changes.title === 'string') {
        const t = changes.title.trim();
        found.title = t.length ? t : 'Enter Set Title';
      }
      if (typeof changes.description === 'string') {
        found.description = changes.description;
      }
      if ('imageUri' in changes) {
        
        found.imageUri = changes.imageUri ?? null;
      }
    },

    removeSet(state, action: PayloadAction<{ collectionId: string; setId: string }>) {
      const { collectionId, setId } = action.payload;
      const list = (state.setsByCollection ?? {})[collectionId] || [];
      if (!state.setsByCollection) state.setsByCollection = {};
      state.setsByCollection[collectionId] = list.filter((s) => s.id !== setId);
    },
    clearSetsForCollection(state, action: PayloadAction<{ collectionId: string }>) {
      if (!state.setsByCollection) state.setsByCollection = {};
      state.setsByCollection[action.payload.collectionId] = [];
    },
  },
});

export const {
  addCollection,
  removeCollection,
  clearCollections,
  addSetToCollection,
  renameSet,
  updateSetInCollection, 
  removeSet,
  clearSetsForCollection,
} = collectionsSlice.actions;


export const selectCollections = (state: RootState) => state.collections.items;

export const selectSetsForCollection = (state: RootState, collectionId: string) =>
  (state.collections.setsByCollection ?? {})[collectionId] ?? [];

export const makeSelectSetsForCollection =
  (collectionId: string) =>
  (state: RootState) =>
    (state.collections.setsByCollection ?? {})[collectionId] ?? [];

export default collectionsSlice.reducer;
