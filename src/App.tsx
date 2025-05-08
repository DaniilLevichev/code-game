import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage/HomePage";
import { GameLevel } from "./components/gameLevel/GameLevel";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/level/:levelId" element={<GameLevel />} />
        {/* <Route path="/first-level" element={<FirstLevel />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
