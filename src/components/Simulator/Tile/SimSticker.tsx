import { DoubleSide } from 'three';
import {Sticker, Stickers} from "../../../types.ts";
import {useSettings} from "../../../hooks/useSettings.ts";

interface Props{
  sticker: {
    index: number,
    sticker: Sticker | null,
    rotation: number
  }
  hover?: boolean;
}

const SimSticker = ({ sticker, hover }: Props) => {
  const { textures } = useSettings();

  if (!sticker.sticker) return null;

  const texture = textures[sticker.sticker];
  const data = Stickers[sticker.sticker];
  const scale = data.scale ? data.scale : 0.75;

  return (
    <mesh position={[0, 0.51 + (hover ? 0.02 : 0), 0]} rotation={[Math.PI / 2 , 0, Math.PI + (sticker.rotation * Math.PI) / 180.0]} scale={[scale, scale, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} color={hover ? 'red' : ''} />
    </mesh>
  );
};

export default SimSticker;

