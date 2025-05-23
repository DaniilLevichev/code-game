import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React from "react";

const testStore = configureStore({
  reducer: {
    game: () => ({
      code: "",
      isStartLevel: false,
    }),
  },
});

export function renderWithProviders(
  ui: React.ReactElement,
  { store = testStore, ...renderOptions } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
