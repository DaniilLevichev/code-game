import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../store/gameSlice";
import { RootState } from "@/store/store";

type PropsType = {
  levelId: number;
};

export const CodeEditor = ({ levelId }: PropsType) => {
  const dispatch = useDispatch();
  const { code } = useSelector((state: RootState) => state.game);
  console.log(levelId);
  return (
    <div className="editor-container">
      <Editor
        defaultLanguage="javascript"
        value={code}
        height="90vh"
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
  );
};
