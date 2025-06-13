import {Barrier, Barriers} from "../../../types.ts";
import {useSettings} from "../../../hooks/useSettings.ts";

const SimBarrierMenu = () => {
  const {selectedBarrier, setSelectedBarrier, barriers3D, setBarriers3D} = useSettings();

  return (
    <>
      <div className={'overflow-y-scroll h-full pb-30 scrollbar-blue'}>
        <ul
          className={`flex mr-2 mx-auto flex-col bg-white-smoke-600 rounded-2xl overflow-hidden shadow translate-y-5`}>
          <li className="flex items-center justify-center bg-white-smoke-400 py-2">
            <input type="checkbox"
                   checked={barriers3D}
                   onChange={() => setBarriers3D(!barriers3D)}
                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"/>
            <label className="text-dark-neutrals-400 text-lg ml-2">3D</label>
          </li>
          {Object.values(Barrier).map((label: string, index) => (
            <li key={index} className={'bg-white-smoke-400 text-center'}>
              <label className="block">
              <input
                  type="radio"
                  name="sticker"
                  value={label}
                  className="hidden peer"
                  checked={selectedBarrier?.toString() === label}
                  onChange={() => {
                    setSelectedBarrier(label as Barrier);
                  }}
                />
                <div
                  className="text-sm font-semibold px-4 py-2 cursor-pointer text-dark-neutrals-400
                            hover:bg-turquoise-700 hover:text-white-smoke-50
                            peer-checked:bg-turquoise-700 peer-checked:text-white-smoke-50">
                  <img src={Barriers[label as Barrier].image} alt={'img'}/>
                  {label.toUpperCase()}
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SimBarrierMenu;
