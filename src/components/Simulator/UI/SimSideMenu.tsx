import SimBarrierMenu from "./SimBarrierMenu.tsx";
import {TileType} from "../../../types.ts";
import SimStickerMenu from "./SimStickerMenu.tsx";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  type: TileType;
}

const SimSideMenu = ({show, setShow, type} : Props) => {

  return (
    <div className={`${!show ? 'translate-x-full' : ''} absolute right-0 top-0 w-32 h-full px-2 transition duration-300`}>
      <div className="absolute inset-0 bg-turquoise-600 pointer-events-none opacity-50"/>
      <div className="relative p-2 text-black font-semibold text-right" onClick={() => setShow(false)}>
        x
      </div>
      {type === TileType.BARRIER ? (
        <SimBarrierMenu />
      ) : null}

      {type === TileType.STICKER ? (
        <SimStickerMenu />
      ) : null}
    </div>
  );
};

export default SimSideMenu;
