import CodePlayground from "./CodePlayground.tsx";
import CodeHeader from "./CodeHeader.tsx";
import {useState} from "react";
import CodeSnippets from "./CodeSnippets.tsx";
import BlockPlayground from "../BlockEditor/BlockPlayground.tsx";
import {useTaskConfig} from "../../hooks/useTaskConfig.ts";
import {useCode} from "../../hooks/useCode.ts";

const CodeScreen = () => {
  const { mode } = useTaskConfig()
  const { modeRef: editorMode } = useCode()
  const [active, setActive] = useState<boolean>(false);
  const [editor, setEditor] = useState<string>(editorMode.current)

  const updateEditor = (editor: string) => {
    setEditor(editor)
    editorMode.current = editor
  }

  const solveEditor = () => {
    return (
      <>
        <div className={editorMode.current === "blockly" ? "w-full h-full" : "hidden"}>
            <BlockPlayground />
          </div>
          <div className={editorMode.current === "python" ? "w-full h-full" : "hidden"}>
            <CodePlayground />
        </div>
      </>
    )
  }

  const editEditor = () => {
    return (
      <>
        {editor === 'python' ? (
            <CodePlayground />
        ) : (
            <BlockPlayground />
        )}
      </>
    )
  }

  return (
    <div className={'w-3/5 flex-center flex-col box-border'}>
      <CodeHeader active={active} setActive={setActive} setEditor={updateEditor} />
      <div className="bg-sunglow-400 w-full flex-1 pt-2 pb-2.5 z-20 relative">
        {mode === "solve" && solveEditor()}
        {mode !== "solve" && editEditor()}
        <CodeSnippets active={active} />
      </div>
    </div>
  );
};

export default CodeScreen;