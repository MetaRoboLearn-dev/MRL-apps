import {useSettings} from "../../hooks/useSettings.ts";
import {TileType} from "../../types.ts";
import {useVehicle} from "../../hooks/useVehicle.ts";

interface Props{
  isHovered: boolean,
}

const SimInterface = ({isHovered}: Props) => {
  const { simFocused, setSimFocused, selectedType, setSelectedType, animationSpeed, setAnimationSpeed } = useSettings();
  const { position, rotation, isMoving, moveQueue } = useVehicle();
  
  return (
    <>
      <div className={'absolute w-full h-full text-white-smoke-50 text-lg text-left p-5 pointer-events-none'}>
        <h1>pos [x: {position.x}, y: {position.y}, z: {position.z}]</h1>
        <h1>rot [x: {rotation.x}, y: {rotation.y}, z: {rotation.z}]</h1>
        <h1>moveQueue: [{moveQueue.length}]</h1>
        <h1>isMoving: [{isMoving.toString()}]</h1>
        <h1>animationSpeed: [{animationSpeed}]</h1>
      </div>

      <div className={`absolute bottom-5 text-lg text-center font-semibold text-dark-neutrals-500 bg-white/80 px-4 py-2 rounded shadow transition-opacity duration-200
                      ${!simFocused && isHovered ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setSimFocused(true)}>
        ✏️ Pritisni za uređivanje simulacije
      </div>

      <div
        /* stavi da je block na manjim ekranima */
        className={`absolute bottom-5 flex select-none transition-opacity duration-200 ${simFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`text-lg text-center font-semibold text-white-smoke-500 bg-tomato-600 px-4 py-2 rounded shadow cursor-pointer`}
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

      <div className="absolute w-full h-full bg-black/25 flex items-center justify-center hidden">
        <div className="bg-sunglow-500 mx-auto min-w-80 max-w-120 p-6 rounded-md shadow-2xl text-dark-neutrals-500">
          <p className="text-3xl font-semibold px-1 pt-1 pb-3 border-b-2 border-sunglow-800">Čestitke!</p>
          <p className="text-xl pt-3 pl-2 pr-5">Uspješno ste uputili vozilo do cilja, svaka čast!</p>
          <p className={'text-lg pt-6 text-right'}>
            <span className={'bg-sunglow-600/70 px-4 py-2 rounded font-semibold transition hover:cursor-pointer hover:bg-sunglow-600'}>Povratak</span>
          </p>
        </div>
      </div>

    </>
  );
};

export default SimInterface;