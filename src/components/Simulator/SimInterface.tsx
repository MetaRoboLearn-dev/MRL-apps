import Dropdown from "../UI/Dropdown.tsx";
import {useSettings} from "../../hooks/useSettings.ts";
import {TileType} from "../../types.ts";
import {useVehicle} from "../../hooks/useVehicle.ts";

const SimInterface = () => {
  const { simFocused, selectedType, setSelectedType } = useSettings();
  const { position, rotation, isMoving } = useVehicle();

  const selectCellType = (item: string) => {
    const key = Object.keys(TileType).find(
      (key) => TileType[key as keyof typeof TileType] === item
    ) as keyof typeof TileType | undefined;

    if (key) {
      setSelectedType(TileType[key]);
    } else {
      console.error(`Invalid cell type: ${item}`);
    }
  };
  
  return (
    <>
      <div className={'absolute w-full h-full text-white-smoke-50 text-lg text-left p-5 pointer-events-none'}>
        <h1>pos [x: {position.x}, y: {position.y}, z: {position.z}]</h1>
        <h1>rot [x: {rotation.x}, y: {rotation.y}, z: {rotation.z}]</h1>
        <h1>isMoving: [{isMoving.toString()}]</h1>
      </div>
      <div className={`h-full px-5 py-5 absolute right-0 top-0 flex flex-col items-start transition duration-400 ease-in-out
                      ${simFocused ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
        <Dropdown items={Object.values(TileType)}
                  current={selectedType.toString()}
                  onSelect={selectCellType}>
          Type
        </Dropdown>
      </div>
    </>
  );
};

export default SimInterface;