import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  level: number;
  code: string;
}

const initialState: GameState = {
  level: 1,
  code: '',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    completeLevel: (state) => {
      state.level += 1;
    },
    resetProgress: (state) => {
      state.level = 1;
      state.code = '';
    },
  },
});

export const { setCode, completeLevel, resetProgress } = gameSlice.actions;
export default gameSlice.reducer;