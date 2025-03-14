import {useContext} from "react";
import {SimFocusedContext} from "../Context.tsx";
import Dropdown from "./UI/Dropdown.tsx";
import {CellType} from "../enums/CellTypes.tsx";

const SimInterface = () => {
  const [simFocused] = useContext(SimFocusedContext);

  return (
    <div className={`bg-turquoise-700 w-full h-20 px-5 top-0 absolute flex items-center shadow-md 
                    transition duration-400 ease-in-out 
                    ${simFocused ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <Dropdown items={Object.values(CellType)}>Type</Dropdown>
    </div>
  );
};

export default SimInterface;