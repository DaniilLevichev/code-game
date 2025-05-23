import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../store/gameSlice";
import { RootState } from "@/store/store";
import { useParams } from "react-router-dom";

export const CodeEditor = () => {
  const dispatch = useDispatch();
  const { code } = useSelector((state: RootState) => state.game);

  const level = useParams();

  return (
    <div className="flex gap-4">
      <div className="editor-container">
        <Editor
          defaultLanguage="javascript"
          value={code}
          height="60vh"
          width="500px"
          theme="vs-dark"
          onChange={(value) => {
            dispatch(setCode(value || ""));
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
      {level?.levelId === "1" ? (
        <div
          className="flex flex-column bg-black-alpha-90 p-4"
          style={{ width: "57%" }}
        >
          <h2 className="">🚀 Привет, Космический Инженер!</h2>
          <div>
            Наш милый инопланетянин приземлился на странной планете и...
            застрял!
          </div>
          <h3>✨ Что нужно сделать:</h3>
          <div>1. «Включи» ноги пришельца!</div>
          <div className="pl-4">
            <div>
              В его «мозг» (то есть в код) нужно добавить волшебную команду:
            </div>
            <code>api.enableMovement();</code>
            <div>Без этого он так и будет стоять, как вкопанный.</div>
          </div>
          <div>2. Управление: </div>
          <div className="pl-4">
            <div>Как только ноги заработают, используй:</div>
            <div>A / D или стрелки ← → — бег влево-вправо</div>
            <div>Пробел / ↑ — прыжок (можно даже от стен отталкиваться!).</div>
          </div>
          <div>3. Куда бежать?</div>
          <div className="pl-4">
            <div>
              Видишь желтый флаг справа вверху? 👉🚩 Это выход! Допрыгай до него
              через платформы:
            </div>
            <div className="pl-2">- Стартуй слева внизу.</div>
            <div className="pl-2">
              - Запрыгивай на коробки, карабкайся выше!
            </div>
          </div>
          <h3>🎯 Условие победы:</h3>
          <div>Дотронься до флага — и наш герой спасен!</div>
          <div>
            🌌 Удачи! Если что-то пошло не так — жми кнопку «Помощь», и мы
            разберемся вместе. Ты справишься! 💪
          </div>
        </div>
      ) : level?.levelId === "2" ? (
        <div
          className="flex flex-column bg-black-alpha-90 p-4"
          style={{ width: "57%" }}
        >
          <h2 className="text-primary">🚀 Уровень 2: Гравитационный хаос!</h2>
          <div>
            Наш пришелец попал в зону нестабильной гравитации! Теперь нужно
            управлять физикой, чтобы спасти его. 👽🌌
          </div>

          <h3>✨ Что нужно сделать:</h3>

          <div>1. Настрой гравитацию:</div>
          <div className="pl-4">
            <div>Используй новый метод из API:</div>
            <div className="text-blue-400">api.physics.setGravity(x, y);</div>
            <div>Без этого персонаж будет падать в пустоту!</div>
          </div>

          <div>2. Создай двигающиеся платформы:</div>
          <div className="pl-4">
            <div>Добавь в код:</div>
            <div className="text-green-400">
              api.world.createMovingBox(x, y, speed);
            </div>
            <div>Платформы останавливаются при ударе о границы</div>
          </div>

          <div>3. Активируй движение:</div>
          <div className="pl-4">
            <div>Не забудь включить управление:</div>
            <div className="text-purple-400">api.movement.enable();</div>
          </div>

          <h3>🎮 Управление:</h3>
          <div className="pl-4">
            <div>← → / A D - Движение в невесомости</div>
            <div>SPACE / ↑ - Усиленный прыжок</div>
            <div className="text-yellow-400">
              Можно менять направление гравитации!
            </div>
          </div>

          <h3>🎯 Цель:</h3>
          <div className="pl-4">
            <div>Достичь парящего флага через двигающиеся платформы</div>
            <div className="text-gray-400">(Теперь он висит намного выше!)</div>
          </div>

          <h3>💡 Подсказки:</h3>
          <div className="pl-4">
            <div>- Пробуй отрицательную гравитацию</div>
            <div>- Создавай "лифты" из платформ</div>
            <div>- Проверь опечатки в коде</div>
          </div>

          <div className="mt-3">
            🌌 Удачи! Если что-то сломалось — жми «Помощь». Ты справишься! 💪
          </div>
        </div>
      ) : level?.levelId === "3" ? (
        <div
          className="flex flex-column bg-black-alpha-90 p-4"
          style={{ width: "57%" }}
        >
          <h2 className="text-primary">🚀 Уровень 3: Архитектор платформ!</h2>
          <div>
            Теперь ты можешь создавать и разрушать платформы! Построй путь для
            пришельца. 👽🔨
          </div>

          <h3>✨ Что нужно сделать:</h3>

          <div>1. Создай платформы:</div>
          <div className="pl-4">
            <div>Используй новый метод:</div>
            <div className="text-blue-400">api.logic.createPlatform(x, y);</div>
            <div>Начни с базовой платформы у старта</div>
          </div>

          <div>2. Управляй движением:</div>
          <div className="pl-4">
            <div>Вызывай методы перемещения:</div>
            <div className="text-green-400">api.movement.moveLeft()</div>
            <div className="text-green-400">api.movement.moveRight()</div>
            <div className="text-green-400">api.movement.jump()</div>
          </div>

          <div>3. Доберись до цели</div>

          <h3>🎮 Особенности управления:</h3>
          <div className="pl-4">
            <div>← → / A D - Точное управление через API</div>
            <div>SPACE / ↑ - Запрограммированный прыжок</div>
            <div className="text-yellow-400">
              Движение работает только через вызовы методов!
            </div>
          </div>

          <h3>💡 Секреты строителя:</h3>
          <div className="pl-4">
            <div>- Удаляй лишние платформы: api.logic.removePlatform(x, y)</div>
            <div>- Следи за позицией: api.logic.getPlayerPosition()</div>
            <div>- Проверяй колбек завершения уровня</div>
          </div>

          <div className="mt-3">
            🌟 Ты теперь инженер-строитель! Если что-то рухнет — перестрой
            заново. 💥
          </div>
        </div>
      ) : level?.levelId === "4" ? (
        <div
          className="flex flex-column bg-black-alpha-90 p-4"
          style={{ width: "57%" }}
        >
          <h2 className="text-primary">
            🚀 Уровень 4: Цикличное строительство!
          </h2>
          <div>
            Теперь нужно строить целые мосты с помощью циклов! Но будь осторожен
            — гравитация усилилась. 👽⏳
          </div>

          <h3>✨ Что нужно сделать:</h3>

          <div>1. Используй циклы для платформ:</div>
          <div className="pl-4">
            <div className="text-blue-400">for/while</div>
            <div>Максимум 15 платформ!</div>
            <div>Пример: api.construction.createPlatform(x, y);</div>
          </div>

          <div>2. Активируй движение:</div>
          <div className="pl-4">
            <div className="text-green-400">api.movement.enable();</div>
            <div>Без этого пришелец не сдвинется</div>
          </div>

          <h3>🎮 Особенности уровня:</h3>
          <div className="pl-4">
            <div>← → / A D - Ограниченная мобильность</div>
            <div>SPACE / ↑ - Сверхтяжелые прыжки</div>
            <div className="text-yellow-400">Гравитация x2! Прыжки короче</div>
          </div>

          <h3>🎯 Сложная цель:</h3>
          <div className="pl-4">
            <div>Доберись до флага на высокой скале</div>
            <div className="text-gray-400">
              (Тебе понадобится минимум 10 платформ!)
            </div>
          </div>

          <h3>💡 Профессиональные советы:</h3>
          <div className="pl-4">
            <div>- Строй платформы лесенкой</div>
            <div>- Используй wall-jump на скалах</div>
            <div>- Следи за счетчиком платформ</div>
          </div>

          <div className="mt-3">
            ⚠️ Внимание! Если не используешь циклы — платформы не создадутся!
          </div>
        </div>
      ) : (
        <div
          className="flex flex-column bg-black-alpha-90 p-4"
          style={{ width: "57%" }}
        >
          <h2 className="text-primary">
            🚀 Уровень 5: Храм древних механизмов!
          </h2>
          <div>
            Теперь нужно активировать древние рычаги и избегать ловушек!
            Опасность повсюду. 👽🔥
          </div>

          <h3>✨ Что нужно сделать:</h3>

          <div>1. Активируй 3 рычага:</div>
          <div className="pl-4">
            <div className="text-blue-400">
              api.mechanics.activateLever(id);
            </div>
            <div>Рычаги находятся в разных частях карты</div>
          </div>

          <div>2. Построй мост через лаву:</div>
          <div className="pl-4">
            <div className="text-green-400">
              api.construction.createPlatform(x, y);
            </div>
            <div>Максимум 20 платформ!</div>
          </div>

          <div>3. Пройди через ворота:</div>
          <div className="pl-4">
            <div className="text-purple-400">api.mechanics.isGateOpen()</div>
            <div>Ворота откроются только после всех рычагов</div>
          </div>

          <h3>🎮 Критические особенности:</h3>
          <div className="pl-4">
            <div>← → - Ультра-тяжелое управление</div>
            <div>SPACE - Короткие прыжки (гравитация x2!)</div>
            <div className="text-yellow-400">Лава мгновенно убивает!</div>
          </div>

          <h3>🎯 Смертельная цель:</h3>
          <div className="pl-4">
            <div>Доберись до открытых ворот</div>
            <div className="text-gray-400">(После активации 3 рычагов)</div>
          </div>

          <h3>💡 Советы выживания:</h3>
          <div className="pl-4">
            <div>- Используй функции для организации кода</div>
            <div>- Отслеживай врага: api.events.onEnemyDetect()</div>
            <div>- Проверяй счетчик платформ</div>
          </div>

          <div className="mt-3">
            ⚠️ Внимание! Код без функций - мгновенная перезагрузка уровня!
          </div>
        </div>
      )}
    </div>
  );
};
