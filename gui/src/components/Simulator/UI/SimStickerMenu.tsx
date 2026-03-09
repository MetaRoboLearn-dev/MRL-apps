import { Sticker, Stickers } from "../../../types.ts";
import { useTaskConfig } from "../../../hooks/useTaskConfig.ts";

const SimStickerMenu = () => {
  const { selectedSticker, setSelectedSticker } = useTaskConfig();

  return (
    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-40 scrollbar-blue">
      <label className="block cursor-pointer">
        <input
          type="radio"
          name="sticker"
          value="UKLONI"
          className="hidden peer"
          checked={!selectedSticker}
          onChange={() => setSelectedSticker(null)}
        />
        <div className="w-16 h-16 flex flex-col items-center justify-center rounded-lg bg-white-smoke-400
                        hover:bg-turquoise-700 hover:text-white-smoke-50
                        peer-checked:ring-2 peer-checked:ring-white peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50
                        transition">
          <img src="/textures/x.png" alt="remove" className="w-8 h-8 object-contain" />
          <span className="text-[10px] font-semibold mt-0.5">UKLONI</span>
        </div>
      </label>
      {Object.values(Sticker).map((label: string, index) => (
        <label key={index} className="block cursor-pointer">
          <input
            type="radio"
            name="sticker"
            value={label}
            className="hidden peer"
            checked={selectedSticker?.toString() === label}
            onChange={() => setSelectedSticker(label as Sticker)}
          />
          <div className="w-16 h-16 flex flex-col items-center justify-center rounded-lg bg-white-smoke-400
                          hover:bg-turquoise-700 hover:text-white-smoke-50
                          peer-checked:ring-2 peer-checked:ring-white peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50
                          transition">
            <img src={Stickers[label as Sticker].image} alt={label} className="w-8 h-8 object-contain" />
            <span className="text-[10px] font-semibold mt-0.5">{label.toUpperCase()}</span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default SimStickerMenu;