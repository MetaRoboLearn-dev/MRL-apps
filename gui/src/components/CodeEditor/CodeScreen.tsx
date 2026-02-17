import CodePlayground from "./CodePlayground.tsx";
import CodeHeader from "./CodeHeader.tsx";
import {useState} from "react";
import CodeSnippets from "./CodeSnippets.tsx";
import BlockPlayground from "../BlockEditor/BlockPlayground.tsx";

const CodeScreen = () => {
  const [active, setActive] = useState<boolean>(false);
  const [editor, setEditor] = useState<string>('blockly')

  return (
    <div className={'w-3/5 flex-center flex-col box-border'}>
      <CodeHeader active={active} setActive={setActive} setEditor={setEditor} />
      <div className="bg-sunglow-400 w-full flex-1 pt-2 pb-2.5 z-20 relative">
        {/*TODO- ovo implementirat kad activityTask ozivi*/}
        {/*<div className={editor === "blockly" ? "w-full h-full" : "hidden"}>*/}
        {/*  <BlockPlayground />*/}
        {/*</div>*/}
        {/*<div className={editor === "python" ? "w-full h-full" : "hidden"}>*/}
        {/*  <CodePlayground />*/}
        {/*</div>*/}
        {editor === 'python' ? (
          <CodePlayground />
        ) : (
          <BlockPlayground />
        )}
        <CodeSnippets active={active} />
      </div>
    </div>
  );
};

export default CodeScreen;