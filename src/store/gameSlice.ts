import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  level: number;
  code: string;
  login: string;
  isStartLevel: boolean;
}

const initialState: GameState = {
  level: 1,
  isStartLevel: false,
  code: "api.enableMovement();",
  login: "",
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    startLevel: (state) => {
      state.isStartLevel = true;
    },
    completeLevel: (state) => {
      state.level += 1;
    },
    resetProgress: (state) => {
      state.level = 1;
      state.code = "";
    },
  },
});

export const { setLogin, setCode, completeLevel, resetProgress, startLevel } =
  gameSlice.actions;
export default gameSlice.reducer;
