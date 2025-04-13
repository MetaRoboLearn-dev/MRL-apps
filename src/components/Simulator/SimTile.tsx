import {useEffect, useState} from "react";
import {TileType, GridInfo} from "../../types.ts";
import {useTexture} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber";
import edge from "/edge.png";
import {useSettings} from "../../hooks/useSettings.ts";
import SimBarrier from "./SimBarrier.tsx";

interface Props {
  index: number;
  position: [x: number, y: number, z: number];
  gridInfo: GridInfo;
  setGridInfo: (newGridInfo: GridInfo) => void;
}

const SimTile = ({index, position, gridInfo, setGridInfo}: Props) => {
  const { selectedType } = useSettings();
  const colorTexture = useTexture(edge);

  const colours: Record<TileType, string> = {
    [TileType.GROUND]: '#3f9b0b',
    [TileType.START]: '#fed857',
    [TileType.FINISH]: '#fe5244',
    [TileType.BARRIER]: 'darkgreen', // #646767
  };

  const [type, setType] = useState<TileType>(TileType.GROUND);
  useEffect(() => {
    setType(() => {
      if (index === gridInfo.start)
        return TileType.START;
      else if (index === gridInfo.finish)
        return TileType.FINISH;
      else if (gridInfo.barriers?.includes(index))
        return TileType.BARRIER;
      return TileType.GROUND;
    })
  }, [index, gridInfo]);

  const [isHovered, setIsHovered] = useState(false);

  const place = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    let newGridInfo: GridInfo = {
      size: gridInfo.size,
      start: gridInfo.start === index ? null : gridInfo.start,
      finish: gridInfo.finish === index ? null : gridInfo.finish,
      barriers: gridInfo.barriers.filter(i => i !== index),
    };

    switch (selectedType) {
      case TileType.START:
        newGridInfo = { ...newGridInfo, start: index };
        break;
      case TileType.FINISH:
        newGridInfo = { ...newGridInfo, finish: index };
        break;
      case TileType.BARRIER:
        newGridInfo = { ...newGridInfo, barriers: [...newGridInfo.barriers, index] };
        break;
      case TileType.GROUND:
        break;
    }
    setGridInfo(newGridInfo);
  };

  return (
    <group position={position}>
      <mesh scale={[1, 1, 1]}
            onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
            onPointerLeave={(event) => (event.stopPropagation(), setIsHovered(false))}
            onClick={place}>
        <boxGeometry/>
        <meshStandardMaterial map={colorTexture} color={isHovered ? 'blue' : colours[type]}/>
      </mesh>

      {type === TileType.FINISH ? (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.15, 2, 0.15]}/>
          <meshStandardMaterial map={colorTexture} color={isHovered ? 'blue' : colours[type]}/>
        </mesh>
      ) : type === TileType.BARRIER ? (
        // <mesh position={[0, 0.88, 0]} receiveShadow={true}>
        //   <boxGeometry args={[1, 0.76, 0.15]}/>
        //   <meshStandardMaterial map={colorTexture} color={isHovered ? 'blue' : colours[type]}/>
        // </mesh>
        <SimBarrier />
      ) : type === TileType.START ? (
        <></>
      ) : null}
    </group>
  )
};

export default SimTile;