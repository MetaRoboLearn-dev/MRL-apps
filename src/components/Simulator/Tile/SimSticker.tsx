import { DoubleSide } from 'three';
import {Sticker, Stickers} from "../../../types.ts";
import {useSettings} from "../../../hooks/useSettings.ts";

interface Props{
  sticker: {
    index: number,
    sticker: Sticker,
    rotation: number
  }
}

const SimSticker = ({ sticker }: Props) => {
  const { textures } = useSettings();
  const texture = textures[sticker.sticker];
  const data = Stickers[sticker.sticker];
  const scale = data.scale ? data.scale : 0.75;

  return (
    <mesh position={[0, 0.51, 0]} rotation={[Math.PI / 2 , 0, Math.PI + (sticker.rotation * Math.PI) / 180.0]} scale={[scale, scale, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
    </mesh>
  );
};

export default SimSticker;

