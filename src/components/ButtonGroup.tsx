import { useDispatch, useSelector } from "react-redux";
import { startLevel } from "../store/gameSlice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { RootState } from "@/store/store";

type DialogType = {
  value: string;
  type: string;
};

const ButtonGroup = () => {
  const { code } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const [visibleHelp, setVisibleHelp] = useState(false);
  const [rows, setRows] = useState<DialogType[]>([
    { value: "", type: "request" },
  ]);

  const executeCode = () => {
    dispatch(startLevel());
  };

  const askOllama = async () => {
    console.log(rows);
    const prompt = rows[rows.length - 1]?.value;
    const res = await fetch("http://localhost:3001/api/ask-ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, code }),
    });
    const data = await res.json();
    const row = [...rows];
    // row.push({ value: data.response || data.error, type: "response" });
    row.push({
      value:
        "🛠️ Цикл словно застрял на одном месте! 💡 Посмотри внимательно: меняется ли переменная i внутри while? Как долго будет выполняться условие i < 5?",
      type: "response",
    });
    row.push({ value: "", type: "request" });
    setRows(row);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={executeCode} className="run-button">
          Запустить код
        </Button>
        <Button onClick={() => setVisibleHelp(true)}>Помощь</Button>
      </div>
      <Dialog
        header="Помощь"
        visible={visibleHelp}
        className="p-button-lg p-button-rounded"
        onHide={() => setVisibleHelp(false)}
        style={{ width: "70vw", height: "90vh" }}
        footer={
          <div className="flex w-full justify-content-center pt-4">
            <Button onClick={() => askOllama()}>Отправить</Button>
            <Button onClick={() => setVisibleHelp(false)}>Закрыть</Button>
          </div>
        }
      >
        {rows.map((item, index: number) => (
          <div
            key={index}
            className="flex"
            style={{
              justifyContent: item.type === "request" ? "end" : "start",
            }}
          >
            <InputTextarea
              value={item.value}
              autoResize
              placeholder="Если возникли сложности, задайте здесь свой вопрос"
              style={{ width: item.type === "request" ? "30%" : "80%" }}
              className="mb-3"
              onChange={(e) => {
                const row = [...rows];
                row[index].value = e.target.value;
                setRows(row);
              }}
            />
          </div>
        ))}
      </Dialog>
    </>
  );
};

export default ButtonGroup;
