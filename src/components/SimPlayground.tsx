import React, {useContext, useState} from "react";
import SimGrid from "./SimGrid.tsx";
import {GridSizeContext} from "../Context.tsx";

interface Props {
  simFocused: boolean;
  setSimFocused: (simFocused: boolean) => void;
}

const SimPlayground = ({ simFocused, setSimFocused }: Props) => {
  const [cursorType, setCursorType] = useState("cursor-pointer");
  const [canGrab, setCanGrab] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [gridSize, setGridSize] = useContext(GridSizeContext);

  const onSimFocus = () => {
    setSimFocused(true);
    setCursorType("");

    console.log(simFocused); // ovo je tu da se ne crveni, maknut kasnije - TEMP_REMOVE
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
    <div
      className={`${cursorType} flex flex-col items-center justify-center w-full h-lvh`}
      tabIndex={0}
      onClick={() => focus()}
      onKeyDown={onSimKeyDown}
      onKeyUp={onSimKeyUp}
      onMouseDown={onSimMouseDown}
      onMouseUp={onSimMouseUp}
      onFocus={onSimFocus}
      onBlur={onSimBlur}
      autoFocus>
      <SimGrid size={5} />
    </div>
  );
};

export default SimPlayground;
