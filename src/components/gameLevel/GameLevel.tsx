import { useParams, useNavigate } from "react-router-dom";
import { GameScene } from "../GameScene";
import { CodeEditor } from "../CodeEditor";

export const GameLevel = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="level-container">
      <div className="level-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← К уровням
        </button>
        <h2>Уровень {levelId}</h2>
        <div></div>
      </div>
      <div className="game-wrapper">
        <GameScene level={Number(levelId)} />
        <CodeEditor levelId={Number(levelId)} />
      </div>
    </div>
  );
};
