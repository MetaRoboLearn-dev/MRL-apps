import {useSettings} from "../../../hooks/useSettings.ts";
import {Barrier, Sticker, TileType} from "../../../types.ts";
import {useVehicle} from "../../../hooks/useVehicle.ts";
import SimModal from "./SimModal.tsx";
import {useUI} from "../../../hooks/useUI.ts";
import {useGrid} from "../../../hooks/useGrid.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {BsArrowLeftCircleFill, BsChevronLeft, BsChevronRight, BsGearFill} from "react-icons/bs";
import {TbCircleDashedLetterA, TbCircleDashedLetterD} from "react-icons/tb";
import SimTileDropdown from "./SimTileDropdown.tsx";
import SimSpeedSlider from "./SimSpeedSlider.tsx";
import SimSideMenu from "./SimSideMenu.tsx";

interface Props{
  isHovered: boolean,
}

const SimInterface = ({isHovered}: Props) => {
  const { simFocused, setSimFocused,
    selectedType, setSelectedType,
    animationSpeed, setAnimationSpeed,
    setSelectedSticker, setSelectedBarrier,
    selectedRotation, rotateBy90 } = useSettings();
  const { start, sizeX, sizeZ } = useGrid();
  const { modalVisible } = useUI();
  const { position, rotation, isMoving, moveQueue } = useVehicle();

  const [tileIndex, setTileIndex] = useState(0);
  const [showTileDropdown, setShowTileDropdown] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const tileValues = Object.values(TileType);
  const dev = false;
  const novo = true;

  const selectNextType = () => {
    const nextIndex = (tileIndex + 1) % tileValues.length;
    setTileIndex(nextIndex);
    setSelectedType(tileValues[nextIndex] as TileType);
  };

  const selectPreviousType = () => {
    const prevIndex = (tileIndex - 1 + tileValues.length) % tileValues.length;
    setTileIndex(prevIndex);
    setSelectedType(tileValues[prevIndex] as TileType);
  };

  useEffect(() => {
    setTileIndex(Object.values(TileType).indexOf(selectedType));
  }, [selectedType]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!simFocused || modalVisible) return;

      if (event.key === 'r') {
        rotateBy90();
      }
      else if (event.key === 'a') {
        selectPreviousType();
      }
      else if (event.key === 'd') {
        selectNextType();
      }
      else if (event.key === 's') {
        setShowSideMenu(!showSideMenu);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalVisible, rotateBy90, selectedType, simFocused, showSideMenu]);

  const handleChangeSticker = (e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    if (!key){
      setSelectedSticker(null);
      return;
    }
    const selectedKey = key as keyof typeof Sticker;
    setSelectedSticker(Sticker[selectedKey]);
  };

  const handleChangeBarrier = (e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    const selectedKey = key as keyof typeof Barrier;
    setSelectedBarrier(Barrier[selectedKey]);
  };

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
                      ${!simFocused && isHovered && !modalVisible && !isMoving ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setSimFocused(true)}>
        ✏️ Pritisni za uređivanje simulacije
      </div>

      {novo ? (
        <div
          className={`absolute bottom-5 select-none transition-opacity duration-200 ${simFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

          <SimTileDropdown show={showTileDropdown} setShow={setShowTileDropdown} />

          <SimSpeedSlider />

          <div className={'flex justify-between'}>
            <div
              className={`text-lg text-center font-semibold text-white-smoke-500 bg-tomato-600 p-2 rounded shadow cursor-pointer`}
              onClick={() => setSimFocused(false)}>
              <BsArrowLeftCircleFill size={20}/>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <span className={'flex items-center cursor-pointer'} onClick={selectPreviousType}>
                <BsChevronLeft size={15} className={'stroke-3 stroke-white-smoke-900'}/>
                <TbCircleDashedLetterA size={25} className={'stroke-3 stroke-white-smoke-900'}/>
              </span>
              <span
                className="w-50 text-center text-3xl font-display font-bold mx-4 text-dark-neutrals-500 cursor-pointer"
                onClick={() => setShowTileDropdown(!showTileDropdown)}>
                {selectedType.toUpperCase()}
              </span>
              <span className={'flex items-center cursor-pointer'} onClick={selectNextType}>
                <TbCircleDashedLetterD size={25} className={'stroke-3 stroke-white-smoke-900'}/>
                <BsChevronRight size={15} className={'stroke-3 stroke-white-smoke-900'}/></span>
            </div>
            <button
              className={`text-lg text-center font-semibold text-dark-neutrals-400 p-2 rounded shadow bg-sunglow-500 cursor-pointer transition`}
              onClick={() => setShowSideMenu(!showSideMenu)}>
              <BsGearFill size={20}/>
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`absolute bottom-5 select-none transition-opacity duration-200 ${simFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <label>Naljepnica: </label>
          <select name="sticker" id="sticker" onChange={handleChangeSticker}>
            <option key={'none'} value={'none'}>
              Ukloni
            </option>
            {Object.entries(Sticker).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label>Prepreka: </label>
          <select name="barrier" id="barrier" onChange={handleChangeBarrier}>
            {Object.entries(Barrier).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <button className={'m-1 px-4 py-1 bg-sunglow-600 rounded'} onClick={rotateBy90}>Okreni (r)</button>
          <span>Rotacija: {selectedRotation}</span>

          <div className={'flex'}>
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
                      className="text-sm px-4 py-2 cursor-pointer hover:bg-turquoise-700 hover:text-white-smoke-50 peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50">
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
        </div>
      )}

      <SimSideMenu show={showSideMenu} setShow={setShowSideMenu} type={selectedType} />
      <SimModal/>
    </>
  );
};

export default SimInterface;