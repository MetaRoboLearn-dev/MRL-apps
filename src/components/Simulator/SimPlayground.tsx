import React, {useContext, useState} from "react";
import SimGrid from "./SimGrid.tsx";
import {SimFocusedContext} from "../../Context.tsx";
import SimInterface from "./SimInterface.tsx";

const SimPlayground = () => {
  const [cursorType, setCursorType] = useState("cursor-pointer");
  const [canGrab, setCanGrab] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [, setSimFocused] = useContext(SimFocusedContext);
  // const [gridSize, setGridSize] = useContext(GridSizeContext);

  const onSimFocus = () => {
    setSimFocused(true);
    setCursorType("");
  }

  const onSimBlur = () => {
    setSimFocused(false);
    setCursorType("cursor-pointer");
  }

  const onSimKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' && !isGrabbing) {
      console.log(cursorType);
      setCanGrab(true);
      setCursorType("cursor-grab");
    }
  }

  const onSimKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' && !isGrabbing) {
      setCanGrab(false);
      setCursorType("");
    }
  }

  const onSimMouseDown = () => {
    if (canGrab) {
      setIsGrabbing(true);
      setCursorType("cursor-grabbing");
    }
  }

  const onSimMouseUp = () => {
    if (canGrab) {
      setIsGrabbing(false);
      setCursorType("cursor-grab");
    }
  }

  return (
    <>
      <div
        className={`bg-turquoise-50 ${cursorType} flex flex-col flex-grow items-center justify-center w-full
                    border-t-8 border-y-10 border-turquoise-700 relative overflow-hidden`}
        tabIndex={0}
        onClick={() => focus()}
        onKeyDown={onSimKeyDown}
        onKeyUp={onSimKeyUp}
       onMouseDown={onSimMouseDown}
        onMouseUp={onSimMouseUp}
        onFocus={onSimFocus}
        onBlur={onSimBlur}
        autoFocus>
        <SimGrid size={5}/>
        <SimInterface />
      </div>
    </>
  );
};

export default SimPlayground;
