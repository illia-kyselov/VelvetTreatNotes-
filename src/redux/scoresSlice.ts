import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ScoresState {
  best: number; 
  last: number;
}

const initialState: ScoresState = {
  best: 0,
  last: 0,
};

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {
    setLastScore(state, action: PayloadAction<number>) {
      state.last = action.payload;
    },
    setBestScore(state, action: PayloadAction<number>) {
      state.best = action.payload;
    },
    setScores(state, action: PayloadAction<{ last: number; best: number }>) {
      state.last = action.payload.last;
      state.best = action.payload.best;
    },
    updateBestIfNeeded(state, action: PayloadAction<number>) {
      const s = action.payload;
      state.last = s;
      if (s > state.best) state.best = s;
    },
    resetScores() {
      return initialState;
    },
  },
});

export const {
  setLastScore,
  setBestScore,
  setScores,
  updateBestIfNeeded,
  resetScores,
} = scoresSlice.actions;

export default scoresSlice.reducer;


type WithScores = { scores: ScoresState };

export const selectScores = (state: WithScores) => state.scores;
export const selectBestScore = (state: WithScores) => state.scores.best;
export const selectLastScore = (state: WithScores) => state.scores.last;
