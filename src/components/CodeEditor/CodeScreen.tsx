import CodePlayground from "./CodePlayground.tsx";
import CodeHeader from "./CodeHeader.tsx";
import {useState} from "react";
import CodeSnippets from "./CodeSnippets.tsx";
import BlockPlayground from "../BlockEditor/BlockPlayground.tsx";
import {useCode} from "../../hooks/useCode.ts";

const CodeScreen = () => {
  const [active, setActive] = useState<boolean>(false);
  const { modeRef } = useCode();

  return (
    <div className={'w-3/5 flex-center flex-col box-border'}>
      <CodeHeader active={active} setActive={setActive}/>
      <div className="bg-sunglow-400 w-full flex-1 pt-2 pb-2.5 z-20 relative">
        <div className={modeRef.current === "blockly" ? "w-full h-full" : "hidden"}>
          <BlockPlayground />
        </div>
        <div className={modeRef.current === "python" ? "w-full h-full" : "hidden"}>
          <CodePlayground />
        </div>
        <CodeSnippets active={active} />
      </div>
    </div>
  );
};

export default CodeScreen;