import { useParams } from "react-router-dom";
import { CodeEditor } from "../CodeEditor";
import ButtonGroup from "../ButtonGroup";
import Level1 from "../gameScenes/Level1";
import Level2 from "../gameScenes/Level2";
import Level3 from "../gameScenes/Level3";
import Level4 from "../gameScenes/Level4";
import Level5 from "../gameScenes/Level5";

export const GameLevel = () => {
  const { levelId } = useParams();
  const level = useParams();

  return (
    <div className="level-container">
      <div className="level-header justify-content-center">
        <h2>Уровень {levelId}</h2>
      </div>
      <div className="game-wrapper">
        <div className="flex pl-6 gap-6">
          {level?.levelId === "1" ? (
            <Level1 />
          ) : level?.levelId === "2" ? (
            <Level2 />
          ) : level?.levelId === "3" ? (
            <Level3 />
          ) : level?.levelId === "4" ? (
            <Level4 />
          ) : (
            <Level5 />
          )}
          <div className="flex flex-column gap-4">
            <CodeEditor />
            <ButtonGroup />
          </div>
        </div>
      </div>
    </div>
  );
};
