import {Sticker, Stickers} from "../../../types.ts";
import {useSettings} from "../../../hooks/useSettings.ts";
const SimStickerMenu = () => {
  const { selectedSticker, setSelectedSticker } = useSettings();

  return (
    <div className={'overflow-y-scroll h-full pb-30 scrollbar-blue'}>
      <ul
        className={`flex mr-2 mx-auto flex-col bg-white-smoke-600 rounded-2xl overflow-hidden shadow translate-y-5`}>
        <li className={'bg-white-smoke-400 text-center'}>
          <label className="block">
            <input
              type="radio"
              name="sticker"
              value={'UKLONI'}
              className="hidden peer"
              checked={!selectedSticker}
              onChange={() => {
                setSelectedSticker(null);
              }}
            />
            <div
              className="text-md font-semibold px-4 py-2 cursor-pointer text-dark-neutrals-400
                            hover:bg-turquoise-700 hover:text-white-smoke-50
                            peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50">
              <img src={'textures/x.png'} alt={'img'}/>
              UKLONI
            </div>
          </label>
        </li>
        {Object.values(Sticker).map((label: string, index) => (
          <li key={index} className={'bg-white-smoke-400 text-center'}>
            <label className="block">
              <input
                type="radio"
                name="sticker"
                value={label}
                className="hidden peer"
                checked={selectedSticker?.toString() === label}
                onChange={() => {
                  setSelectedSticker(label as Sticker);
                }}
              />
              <div
                className="text-sm font-semibold px-4 py-2 cursor-pointer text-dark-neutrals-400
                            hover:bg-turquoise-700 hover:text-white-smoke-50
                            peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50">
                <img src={Stickers[label as Sticker].image} alt={'img'}/>
                {label.toUpperCase()}
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimStickerMenu;
