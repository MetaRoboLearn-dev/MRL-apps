import {useSettings} from "../../hooks/useSettings.ts";
import {TileType} from "../../types.ts";
import {useVehicle} from "../../hooks/useVehicle.ts";
import SimModal from "./SimModal.tsx";
import {useUI} from "../../hooks/useUI.ts";
import {useGrid} from "../../hooks/useGrid.ts";

interface Props{
  isHovered: boolean,
}

const SimInterface = ({isHovered}: Props) => {
  const { simFocused, setSimFocused, selectedType, setSelectedType, animationSpeed, setAnimationSpeed } = useSettings();
  const { start, sizeX, sizeZ } = useGrid();
  const { modalVisible } = useUI();
  const { position, rotation, isMoving, moveQueue } = useVehicle();

  const dev = false;

  return (
    <>
      <div className={`${dev ? '' : 'hidden'} absolute w-full h-full text-white-smoke-50 text-lg text-left p-5 pointer-events-none`}>
        <h1>pos [x: {position.x}, y: {position.y}, z: {position.z}]</h1>
        <h1>rot [x: {rotation.x}, y: {rotation.y}, z: {rotation.z}]</h1>
        <h1>moveQueue: [{moveQueue.length}]</h1>
        <h1>isMoving: [{isMoving.toString()}]</h1>
        <h1>animationSpeed: [{animationSpeed}]</h1>
        <h1>start: [{start}]</h1>
        <h1>sizeX: [{sizeX}], sizeZ: [{sizeZ}]</h1>
      </div>

      <div className={`absolute bottom-5 text-lg text-center font-semibold text-dark-neutrals-500 bg-white/80 px-4 py-2 rounded shadow transition-opacity duration-200 select-none
                      ${!simFocused && isHovered && !modalVisible ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setSimFocused(true)}>
        ✏️ Pritisni za uređivanje simulacije
      </div>

      <div
        /* stavi da je block na manjim ekranima */
        className={`absolute bottom-5 flex select-none transition-opacity duration-200 ${simFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className={`text-lg text-center font-semibold text-white-smoke-500 bg-tomato-600 px-4 py-2 rounded shadow cursor-pointer`}
          onClick={() => setSimFocused(false)}>
          ↩️ Povratak
        </div>

        <ul className="flex flex-row bg-white-smoke-600 rounded-2xl mx-4 overflow-hidden shadow">
          {Object.values(TileType).map((item: string, index) => (
            <li key={index} className={'bg-white-smoke-400'}>
              <label className="block">
                <input
                  type="radio"
                  name="tileType"
                  value={item}
                  className="hidden peer"
                  checked={selectedType.toString() === item}
                  onChange={() => setSelectedType(item as TileType)}
                />
                <div
                  className="text-lg px-4 py-2 cursor-pointer hover:bg-turquoise-700 hover:text-white-smoke-50 peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50">
                  {item}
                </div>
              </label>
            </li>
          ))}
          <div className={'flex flex-row items-center justify-center mx-4'}>
            <label htmlFor="steps-range" className="text-md text-dark-neutrals-600 mr-4">Brzina</label>
            <input id="steps-range"
                   type="range"
                   min="20"
                   max="100"
                   step="10"
                   value={animationSpeed * 1000}
                   onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                   className={'w-30'}/>
          </div>
        </ul>
      </div>

      <SimModal />
    </>
  );
};

export default SimInterface;