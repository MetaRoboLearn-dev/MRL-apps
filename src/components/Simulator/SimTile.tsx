import {useEffect, useState} from "react";
import {TileType} from "../../types.ts";
// import {useTexture} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber";
// import edge from "/edge.png";
import {useSettings} from "../../hooks/useSettings.ts";
import SimBarrier from "./SimBarrier.tsx";
import {useGrid} from "../../hooks/useGrid.ts";

interface Props {
  index: number;
  position: [x: number, y: number, z: number];
}

const SimTile = ({index, position}: Props) => {
  const { simFocused, selectedType } = useSettings();
  const { start, setStart, finish, setFinish, barriers, setBarriers } = useGrid();
  const [isHovered, setIsHovered] = useState(false);
  // const colorTexture = useTexture(edge);
  // napravi chekerboard za parne Z
  const odd = index % 2;

  const colours: Record<TileType, string> = {
    [TileType.GROUND]: odd ? '#3f9b0b' : '#3b930a',
    [TileType.START]: '#fed857',
    [TileType.FINISH]: '#fe5244',
    [TileType.BARRIER]: odd ? '#008000' : '#007500', // #646767
  };

  const [type, setType] = useState<TileType>(TileType.GROUND);
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

    setStart(start === index ? null : start);
    setFinish(finish === index ? null : finish);
    setBarriers(barriers.filter(i => i !== index));

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
    }
  };

  return (
    <group position={position}>
      <mesh scale={[1, 1, 1]} receiveShadow={true}
            onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
            onPointerLeave={(event) => (event.stopPropagation(), setIsHovered(false))}
            onClick={place}>
        <boxGeometry/>
        <meshStandardMaterial // map={colorTexture}
                              emissive={'black'}
                              emissiveIntensity={index % 2 === 1 ? 0.5 : 0}
                              color={(isHovered && simFocused) ? 'blue' : colours[type]}/>
      </mesh>

      {type === TileType.FINISH ? (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.15, 2, 0.15]}/>
          <meshStandardMaterial //map={colorTexture}
                                color={(isHovered && simFocused) ? 'blue' : colours[type]}/>
        </mesh>
      ) : type === TileType.BARRIER ? (
        <SimBarrier />
      ) : type === TileType.START ? (
        <></>
      ) : null}
    </group>
  )
};

export default SimTile;