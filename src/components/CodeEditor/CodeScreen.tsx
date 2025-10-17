import CodePlayground from "./CodePlayground.tsx";
import CodeHeader from "./CodeHeader.tsx";
import {useState} from "react";
import CodeSnippets from "./CodeSnippets.tsx";
import BlockPlayground from "../BlockEditor/BlockPlayground.tsx";
import {useSettings} from "../../hooks/useSettings.ts";

const CodeScreen = () => {
  const [active, setActive] = useState<boolean>(false);
  const { selectedTab } = useSettings();
  const parsed = (() => {
    try {
      return JSON.parse(localStorage.getItem(selectedTab) || '{}');
    } catch {
      return {};
    }
  })();

  return (
    <div className={'w-3/5 flex flex-col items-center justify-center box-border'}>
      <CodeHeader active={active} setActive={setActive}/>
      <div className={'bg-sunglow-400 w-full h-[0px] flex-grow pt-2 pb-2.5 z-20 relative'}>
        {!parsed || parsed.mode === "blockly" ? (
          <BlockPlayground />
        ) : (
          <CodePlayground />
        )}
        <CodeSnippets active={active} />
      </div>
    </div>
  );
};

export default CodeScreen;