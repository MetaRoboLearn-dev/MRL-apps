import {useState} from "react";
import SimPlayground from "./SimPlayground.tsx";

const SimScreen = () => {
  const [simFocused, setSimFocused] = useState(false);

  return (
    <div className={`bg-gradient-to-t from-green-300 to-green-200 w-2/5 flex flex-col items-center justify-center ${simFocused ? 'border-4 border-rose-400 border-solid' : ''} `}>
      <SimPlayground simFocused={simFocused} setSimFocused={setSimFocused} />
    </div>
  );
};

export default SimScreen;
