import {useEffect, useState} from "react";
import {Stickers, TileType} from "../../types.ts";
import {ThreeEvent} from "@react-three/fiber";
import {useSettings} from "../../hooks/useSettings.ts";
import SimBarrier from "./SimBarrier.tsx";
import {useGrid} from "../../hooks/useGrid.ts";
import SimSticker from "./SimSticker.tsx";

interface Props {
  index: number;
  position: [x: number, y: number, z: number];
}

const SimTile = ({index, position}: Props) => {
  const { simFocused, selectedType, selectedPlaceable } = useSettings();
  const { start, setStart, finish, setFinish, barriers, setBarriers, stickers, setStickers } = useGrid();
  const [isHovered, setIsHovered] = useState(false);
  const [type, setType] = useState<TileType>(TileType.GROUND);
  const sticker = stickers.find((s) => s.index === index);

  const colours: Record<TileType, string> = {
    [TileType.GROUND]: index % 2 ? '#3f9b0b' : '#3b930a',
    [TileType.START]: '#fed857',
    [TileType.FINISH]: '#fe5244',
    [TileType.BARRIER]: index % 2 ? '#008000' : '#007500', // #646767
    [TileType.STICKER]: '#ffffff',
  };

  useEffect(() => {
    setType(() => {
      if (index === start)
        return TileType.START;
      else if (index === finish)
        return TileType.FINISH;
      else if (barriers.includes(index))
        return TileType.BARRIER;
      return TileType.GROUND;
    })
  }, [barriers, finish, index, start]);

  const place = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!simFocused) return;

    if (selectedType !== TileType.STICKER){
      setStart(start === index ? null : start);
      setFinish(finish === index ? null : finish);
      setBarriers(barriers.filter(i => i !== index));
    }
    else {
      setStickers(stickers.filter(i => i.index !== index));
    }

    switch (selectedType) {
      case TileType.START:
        setStart(index);
        break;
      case TileType.FINISH:
        setFinish(index);
        break;
      case TileType.BARRIER:
        setBarriers([...barriers, index]);
        break;
      case TileType.GROUND:
        break;
      case TileType.STICKER:
        setStickers([...stickers, {index: index, sticker: Stickers[selectedPlaceable]}])
        break;
    }
  };

  return (
    <group position={position}>
      <mesh scale={[1, 1, 1]} receiveShadow={true}
            onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
            onPointerLeave={(event) => (event.stopPropagation(), setIsHovered(false))}
            onClick={place}>
        <boxGeometry/>
        <meshStandardMaterial emissive={'black'}
                              emissiveIntensity={index % 2 === 1 ? 0.5 : 0}
                              color={(isHovered && simFocused) ? 'blue' : colours[type]}/>
      </mesh>

      {type === TileType.FINISH ? (
        <></>
      ) : type === TileType.BARRIER ? (
        <SimBarrier />
      ) : type === TileType.START ? (
        <></>
      ) : null}

      {sticker ? (
        <SimSticker sticker={sticker}/>
      ) : null}
    </group>
  )
};

export default SimTile;