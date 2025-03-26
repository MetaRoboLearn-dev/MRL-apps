import {useContext} from "react";
import {SimFocusedContext, SimSettingsContext} from "../../Context.tsx";
import Dropdown from "../UI/Dropdown.tsx";
import {CellType} from "../../enums/CellTypes.tsx";

const SimInterface = () => {
  const [simFocused] = useContext(SimFocusedContext);
  const [simSettings, setSimSettings] = useContext(SimSettingsContext);

  const selectCellType = (item: string) => {
    const key = Object.keys(CellType).find(
      (key) => CellType[key as keyof typeof CellType] === item
    ) as keyof typeof CellType | undefined;

    if (key) {
      setSimSettings({
        cellType: CellType[key],
      });
    } else {
      console.error(`Invalid cell type: ${item}`);
    }
  };
  
  return (
    <div className={`h-full px-5 py-5 absolute right-0 top-0 flex flex-col items-start transition duration-400 ease-in-out
                      ${simFocused ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <Dropdown items={Object.values(CellType)}
                current={simSettings.cellType.toString()}
                onSelect={selectCellType}>
        Type
      </Dropdown>
    </div>
  );
};

export default SimInterface;