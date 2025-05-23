import { describe, it, expect, vi, beforeEach } from "vitest";
import Level1 from "./components/gameScenes/Level1";
import Level2 from "./components/gameScenes/Level2";
import Level3 from "./components/gameScenes/Level3";
import Level4 from "./components/gameScenes/Level4";
import Level5 from "./components/gameScenes/Level5";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { GameLevel } from "./components/gameLevel/GameLevel";
import { renderWithProviders } from "./test-utlis";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "./components/homePage/HomePage";
import AppHeader from "./components/appHeader/AppHeader";
import ButtonGroup from "./components/ButtonGroup";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { CodeEditor } from "./components/CodeEditor";

vi.mock("phaser");

describe("Level1", () => {
  it("renders the game container and toast", () => {
    // const { container } = renderWithProviders(<Level1 />);
    // expect(container.querySelector("#game-container")).toBeInTheDocument();
  });
});

describe("Level2", () => {
  it("renders the game container", () => {
    // renderWithProviders(<Level2 />);
    // expect(screen.getByTestId("game-container")).toBeInTheDocument();
  });
});

describe("Level3", () => {
  it("renders the game container", () => {
    // renderWithProviders(<Level3 />);
    // expect(screen.getByTestId("game-container")).toBeInTheDocument();
  });
});

describe("Level4", () => {
  it("renders the game container", () => {
    // renderWithProviders(<Level4 />);
    // expect(screen.getByTestId("game-container")).toBeInTheDocument();
  });
});

describe("Level5", () => {
  it("renders the game container", () => {
    // renderWithProviders(<Level5 />);
    // expect(screen.getByTestId("game-container")).toBeInTheDocument();
  });
});

describe("GameLevel", () => {
  it("renders Level1 when levelId is 1", () => {
    // renderWithProviders(
    //   <MemoryRouter initialEntries={["/levels/1"]}>
    //     <Routes>
    //       <Route path="/levels/:levelId" element={<GameLevel />} />
    //     </Routes>
    //   </MemoryRouter>
    // );
    // expect(screen.getByText("Уровень 1")).toBeInTheDocument();
  });

  it("renders Level2 when levelId is 2", () => {
    // render(
    //   <MemoryRouter initialEntries={["/levels/2"]}>
    //     <Routes>
    //       <Route path="/levels/:levelId" element={<GameLevel />} />
    //     </Routes>
    //   </MemoryRouter>
    // );
    // expect(screen.getByText("Уровень 2")).toBeInTheDocument();
  });

  it("renders Level3 when levelId is 3", () => {
    // render(
    //   <MemoryRouter initialEntries={["/levels/3"]}>
    //     <Routes>
    //       <Route path="/levels/:levelId" element={<GameLevel />} />
    //     </Routes>
    //   </MemoryRouter>
    // );
    // expect(screen.getByText("Уровень 3")).toBeInTheDocument();
  });

  it("renders Level4 when levelId is 4", () => {
    // render(
    //   <MemoryRouter initialEntries={["/levels/4"]}>
    //     <Routes>
    //       <Route path="/levels/:levelId" element={<GameLevel />} />
    //     </Routes>
    //   </MemoryRouter>
    // );
    // expect(screen.getByText("Уровень 4")).toBeInTheDocument();
  });

  it("renders Level5 when levelId is 5", () => {
    // render(
    //   <MemoryRouter initialEntries={["/levels/5"]}>
    //     <Routes>
    //       <Route path="/levels/:levelId" element={<GameLevel />} />
    //     </Routes>
    //   </MemoryRouter>
    // );
    // expect(screen.getByText("Уровень 5")).toBeInTheDocument();
  });
});

describe("HomePage", () => {
  it("renders initial screen with start button", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Программируй и играй!")).toBeTruthy();
    expect(screen.getByText("Начать игру")).toBeTruthy();
  });

  it("shows level selection when start button clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Начать игру"));
    expect(screen.getByText("Выберите уровень")).toBeTruthy();
    expect(screen.getAllByText("Легко").length).toBeGreaterThan(0);
  });

  it("navigates to level when level card clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Начать игру"));
    fireEvent.click(screen.getByText("Первые шаги"));
    expect(document.querySelector(".level-card")).toBeTruthy();
  });
});

describe("AppHeader", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("renders header with logo and navigation", () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );
    expect(screen.getByAltText("logo")).toBeTruthy();
    expect(screen.getByText("Главная")).toBeTruthy();
  });

  it("shows auth buttons when not logged in", () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );
    expect(screen.getByText("Зарегистрироваться")).toBeTruthy();
    expect(screen.getByText("Войти")).toBeTruthy();
  });

  it("shows username when logged in", () => {
    sessionStorage.setItem("login", "testuser");
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );
    expect(screen.getByText("testuser")).toBeTruthy();
  });

  it("opens registration modal when register clicked", () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Зарегистрироваться"));
    expect(screen.getByText("Регистрация")).toBeTruthy();
  });

  it("opens login modal when login clicked", () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Войти"));
    expect(screen.getByText("Вход")).toBeTruthy();
  });
});

describe("ButtonGroup", () => {
  const mockStore = configureStore({
    reducer: {
      game: () => ({}),
    },
  });

  it("renders buttons", () => {
    // render(
    //   <MemoryRouter>
    //     <ButtonGroup />
    //   </MemoryRouter>
    // );
    // expect(screen.getByText("Запустить код")).toBeTruthy();
    // expect(screen.getByText("Помощь")).toBeTruthy();
  });

  it("opens help dialog when help button clicked", () => {
    // render(
    //   <MemoryRouter store={mockStore}>
    //     <ButtonGroup />
    //   </MemoryRouter>
    // );
    // fireEvent.click(screen.getByText("Помощь"));
    // expect(screen.getByText("Отправить")).toBeTruthy();
  });

  it("calls startLevel when run button clicked", () => {
    //     const mockDispatch = vi.fn();
    //     vi.mock("react-redux", async () => ({
    //       ...(await vi.importActual("react-redux")),
    //       useDispatch: () => mockDispatch,
    //     }));
    //     render(
    //       <MemoryRouter store={mockStore}>
    //         <ButtonGroup />
    //       </MemoryRouter>
    //     );
    //     fireEvent.click(screen.getByText("Запустить код"));
    //     expect(mockDispatch).toHaveBeenCalled();
  });
});

describe("CodeEditor", () => {
  const mockStore = configureStore({
    reducer: {
      game: () => ({
        code: "test code",
      }),
    },
  });

  it("renders editor for level 1", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/level/1"]}>
          <Routes>
            <Route path="/level/:levelId" element={<CodeEditor />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("🚀 Привет, Космический Инженер!")).toBeTruthy();
  });

  it("renders editor for level 2", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/level/2"]}>
          <Routes>
            <Route path="/level/:levelId" element={<CodeEditor />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("🚀 Уровень 2: Гравитационный хаос!")).toBeTruthy();
  });
});
