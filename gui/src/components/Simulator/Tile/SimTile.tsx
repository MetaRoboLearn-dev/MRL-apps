import {useEffect, useState} from "react";
import {TileType} from "../../../types.ts";
import {ThreeEvent} from "@react-three/fiber";
import {useSettings} from "../../../hooks/useSettings.ts";
import SimBarrier from "./SimBarrier.tsx";
import {useGrid} from "../../../hooks/useGrid.ts";
import SimSticker from "./SimSticker.tsx";
import SimVehicleOutline from "./SimVehicleOutline.tsx";

interface Props {
  index: number;
  position: [x: number, y: number, z: number];
}

const SimTile = ({index, position}: Props) => {
  const { simFocused, selectedType, selectedSticker, selectedBarrier, selectedRotation } = useSettings();
  const { start, setStart,
          setStartRotationOffset,
          finish, setFinish,
          barriers, setBarriers,
          stickers, setStickers } = useGrid();

  const [isHovered, setIsHovered] = useState(false);
  const [type, setType] = useState<TileType>(TileType.GROUND);

  const barrier_keys = [...barriers.keys()];

  const barrier = barriers.get(index);
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
      else if (barrier_keys.includes(index))
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
      setBarriers(new Map([...barriers].filter(([key]) => key !== index))
      );
    }
    else {
      setStickers(stickers.filter(i => i.index !== index));
    }

    switch (selectedType) {
      case TileType.START:
        setStart(index);
        setStartRotationOffset(selectedRotation);
        break;
      case TileType.FINISH:
        setFinish(index);
        break;
      case TileType.BARRIER:
        setBarriers(new Map(barriers).set(index, selectedBarrier));
        break;
      case TileType.GROUND:
        break;
      case TileType.STICKER:
        if (selectedSticker) {
          const updated = [
            ...stickers.filter(i => i.index !== index),
            { index, sticker: selectedSticker, rotation: selectedRotation }
          ];
          setStickers(updated);
        }
        break;
    }
  };

  return (
    <group position={position}>
      {
        // ovo bi se moglo koristit za barrijeru rupa
        !([-1].includes(index)) ? (
          <mesh scale={[1, 0.2, 1]} receiveShadow={true}
                onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
                onPointerLeave={(event) => (event.stopPropagation(), setIsHovered(false))}
                onClick={place}>
            <boxGeometry/>
            <meshStandardMaterial emissive={'black'}
                                  emissiveIntensity={index % 2 === 1 ? 0.5 : 0}
                                  color={(isHovered && simFocused) ? 'blue' : colours[type]}/>
          </mesh>
        ) : null
      }

      {type === TileType.BARRIER ? (
        <SimBarrier barrier={barrier} />
      ) : null}

      {sticker ? (
        <SimSticker sticker={sticker}/>
      ) : null}

      {simFocused && isHovered && selectedType === TileType.STICKER ? (
        <SimSticker hover={true} sticker={{
          index: index,
          sticker: selectedSticker,
          rotation: selectedRotation,
        }} />
      ) : null}

      {simFocused && isHovered && selectedType === TileType.START ? (
        <SimVehicleOutline />
      ) : null}
    </group>
  )
};

export default SimTile;