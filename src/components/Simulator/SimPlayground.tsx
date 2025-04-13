import {useState} from "react";
import SimInterface from "./SimInterface.tsx";
import SimCanvas from "./SimCanvas.tsx";
import {useSettings} from "../../hooks/useSettings.ts";

const SimPlayground = () => {
  const { setSimFocused } = useSettings();
  const [cursorType, setCursorType] = useState("cursor-pointer");

  const onSimFocus = () => {
    setSimFocused(true);
    setCursorType("");
  }

  const onSimBlur = () => {
    setSimFocused(false);
    setCursorType("cursor-pointer");
  }

  return (
    <div className={`bg-turquoise-50 ${cursorType} flex flex-col flex-grow items-center justify-center w-full
                  border-t-8 border-y-10 border-turquoise-700 relative overflow-hidden`}
         tabIndex={0} autoFocus
         onClick={() => focus()} onFocus={onSimFocus} onBlur={onSimBlur}>
      <SimCanvas />
      <SimInterface />
    </div>
  );
};

export default SimPlayground;
