import React, {useRef, useState} from "react";

const Simulation = () => {
  const [holdingSpace, setHoldingSpace] = useState(false);
  const [simFocused, setSimFocused] = useState(false);
  const simRef = useRef<HTMLDivElement>(null);

  const onSpaceDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ') {
      setHoldingSpace(true);
    }
  }

  const onSpaceUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ') {
      setHoldingSpace(false);
    }
  }

  return (
    <div className={`bg-emerald-200 w-2/5 flex flex-col items-center justify-center ${simFocused ? '' : 'cursor-pointer'} ${holdingSpace ? 'cursor-grab' : ''}`}
         ref={simRef}
         tabIndex={0}
         onClick={() => focus()}
         onKeyDown={onSpaceDown}
         onKeyUp={onSpaceUp}
         onFocus={() => setSimFocused(true)}
         onBlur={() => setSimFocused(false)}
         autoFocus>
      <img src={"src/assets/example.jpg"} alt={"guteeer"} className={"w-3/5 mb-4"}/>
      <p>{holdingSpace ? "Držiš space!" : "Ne držiš space."}</p>
    </div>
  );
};

export default Simulation;
