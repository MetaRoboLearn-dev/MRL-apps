import { useLoader } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three';
import {PlaceableSticker} from "../../types.ts";

interface Props{
  sticker: {
    index: number;
    sticker: PlaceableSticker
  }
}

const SimSticker = ({ sticker }: Props) => {
  const texture = useLoader(TextureLoader, sticker.sticker.image);

  return (
    <mesh position={[0, 0.51, 0]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[0.75, 0.75, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
    </mesh>
  );
};

export default SimSticker;

