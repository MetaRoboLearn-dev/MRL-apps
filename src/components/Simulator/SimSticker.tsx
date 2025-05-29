import { DoubleSide } from 'three';
import {PlaceableSticker} from "../../types.ts";
import {useSettings} from "../../hooks/useSettings.ts";

interface Props{
  sticker: {
    index: number;
    sticker: PlaceableSticker
  }
}

const SimSticker = ({ sticker }: Props) => {
  const { textures } = useSettings();
  const texture = textures[sticker.sticker.type]; // or dynamic key

  return (
    <mesh position={[0, 0.51, 0]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[0.75, 0.75, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
    </mesh>
  );
};

export default SimSticker;

