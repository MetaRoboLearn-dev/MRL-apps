import CodePlayground from "./CodePlayground.tsx";
import CodeHeader from "./CodeHeader.tsx";
import {useMemo, useState} from "react";
import CodeSnippets from "./CodeSnippets.tsx";
import BlockPlayground from "../BlockEditor/BlockPlayground.tsx";
import {useSettings} from "../../hooks/useSettings.ts";

const CodeScreen = () => {
  const [active, setActive] = useState<boolean>(false);
  const { selectedTab } = useSettings();
  const parsed = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(selectedTab) || '{}');
    } catch {
      return {};
    }
  }, [selectedTab]);

  return (
    <div className={'w-3/5 flex flex-col items-center justify-center box-border'}>
      <CodeHeader active={active} setActive={setActive}/>
      <div className="bg-sunglow-400 w-full flex-1 pt-2 pb-2.5 z-20 relative">
        <div className={parsed.mode === "blockly" ? "w-full h-full" : "hidden"}>
          <BlockPlayground mode={parsed.mode} />
        </div>
        <div className={parsed.mode === "python" ? "w-full h-full" : "hidden"}>
          <CodePlayground />
        </div>
        <CodeSnippets active={active} />
      </div>
    </div>
  );
};

export default CodeScreen;