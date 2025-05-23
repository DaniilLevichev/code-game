import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [showLevels, setShowLevels] = useState(false);
  const navigate = useNavigate();
  const [levels, setLevels] = useState([
    {
      id: 1,
      title: "Первые шаги",
      description: "Основы перемещения персонажа",
      difficulty: "easy",
      completed: false,
      locked: false,
    },
    {
      id: 2,
      title: "Прыжки",
      description: "Изучаем гравитацию и коллизии",
      difficulty: "easy",
      completed: false,
      locked: true,
    },
    {
      id: 3,
      title: "Алгоритмы",
      description: "Простые алгоритмические задачи",
      difficulty: "medium",
      completed: false,
      locked: true,
    },
    {
      id: 4,
      title: "Циклы",
      description: "Автоматизация повторяющихся действий",
      difficulty: "medium",
      completed: false,
      locked: true,
    },
    // {
    //   id: 5,
    //   title: "Финальный уровень",
    //   description: "Комплексная задача",
    //   difficulty: "hard",
    //   completed: false,
    //   locked: true,
    // },
  ]);

  useEffect(() => {
    getComletedLevels();
  }, []);

  const getComletedLevels = async () => {
    const username = sessionStorage.getItem("login");
    try {
      const response = await fetch(
        `http://localhost:3001/api/completed-levels?username=${username}`
      );
      const data = await response.json();
      console.log(data);
      const completedLevels = data.completedLevels;
      setLevels((levels) => {
        return levels.map((item) => {
          if (item.id <= completedLevels + 1) {
            if (item.id <= completedLevels) {
              item.completed = true;
            }
            item.locked = false;
          }
          return item;
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStartClick = () => setShowLevels(true);
  const handleBackClick = () => setShowLevels(false);
  const handleLevelSelect = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    if (level && !level.locked) {
      navigate(`/level/${levelId}`);
    }
  };

  return (
    <div className="home-container">
      {!showLevels ? (
        <div className="preview-section">
          <h1>Программируй и играй!</h1>
          <div className="game-preview">
            <div className="preview-content">
              <div className="preview-animation">
                <div className="character"></div>
                <div className="platform"></div>
                <div className="coin"></div>
              </div>
              <p>
                Решай задачи, пиши код и прокачивай навыки программирования!
              </p>
            </div>
          </div>
          <button className="start-button" onClick={handleStartClick}>
            Начать игру
          </button>
        </div>
      ) : (
        <div className="levels-section">
          <div className="levels-header">
            <button className="back-button" onClick={handleBackClick}>
              ← Назад
            </button>
            <h2>Выберите уровень</h2>
            <div></div> {/* Пустой div для выравнивания */}
          </div>

          <div className="levels-list">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`level-card ${level.completed ? "completed" : ""} ${
                  level.locked ? "locked" : ""
                }`}
                onClick={() => !level.locked && handleLevelSelect(level.id)}
              >
                <div className="level-header">
                  <h3>{level.title}</h3>
                  <span className={`difficulty ${level.difficulty}`}>
                    {level.difficulty === "easy"
                      ? "Легко"
                      : level.difficulty === "medium"
                      ? "Средне"
                      : "Сложно"}
                  </span>
                </div>
                <p>{level.description}</p>
                {level.locked ? (
                  <span className="status">🔒 Заблокирован</span>
                ) : level.completed ? (
                  <span className="status">✓ Пройден</span>
                ) : (
                  <span className="status">Новый</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
