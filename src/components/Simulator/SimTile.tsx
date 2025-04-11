import {useContext, useEffect, useRef, useState} from "react";
import {SimSettingsContext} from "../../Context.tsx";
import {CellType} from "../../enums/CellTypes.tsx";
import {GridInfo} from "../../interfaces.tsx";
import {useTexture} from "@react-three/drei";
import {Mesh} from "three";
import {ThreeEvent} from "@react-three/fiber";
import edge from "../../../public/edge.png";
import SimVehicle from "./SimVehicle.tsx";

interface Props {
  index: number;
  position: [x: number, y: number, z: number];
  gridInfo: GridInfo;
  setGridInfo: (newGridInfo: GridInfo) => void;
}

const SimTile = ({index, position, gridInfo, setGridInfo}: Props) => {
  const colorTexture = useTexture(edge);
  const [simSettings, ] = useContext(SimSettingsContext);

  const colours: Record<CellType, string> = {
    [CellType.GROUND]: '#3f9b0b',
    [CellType.START]: '#fed857',
    [CellType.FINISH]: '#fe5244',
    [CellType.BARRIER]: 'darkgreen', // #646767
  };

  const [type, setType] = useState<CellType>(CellType.GROUND);
  useEffect(() => {
    setType(() => {
      if (index === gridInfo.start)
        return CellType.START;
      else if (index === gridInfo.finish)
        return CellType.FINISH;
      else if (gridInfo.barriers?.includes(index))
        return CellType.BARRIER;
      return CellType.GROUND;
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

    switch (simSettings.cellType) {
      case CellType.START:
        newGridInfo = { ...newGridInfo, start: index };
        break;
      case CellType.FINISH:
        newGridInfo = { ...newGridInfo, finish: index };
        break;
      case CellType.BARRIER:
        newGridInfo = { ...newGridInfo, barriers: [...newGridInfo.barriers, index] };
        break;
      case CellType.GROUND:
        break;
    }
    setGridInfo(newGridInfo);
  };

  const ref = useRef<Mesh>(null);
  if (ref.current) {
    const curr = ref.current;
    curr.position.y = isHovered ? 0 : 0;
  }

  return (
    <group position={position}>
      <mesh ref={ref}
            onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
            onPointerLeave={(event) => (event.stopPropagation(), setIsHovered(false))}
            onClick={place}>
        <boxGeometry/>
        <meshStandardMaterial map={colorTexture} color={isHovered ? 'blue' : colours[type]}/>
      </mesh>

      {type === CellType.FINISH ? (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.15, 2, 0.15]}/>
          <meshStandardMaterial map={colorTexture} color={isHovered ? 'blue' : colours[type]}/>
        </mesh>
      ) : type === CellType.BARRIER ? (
        <mesh position={[0, 0.88, 0]} receiveShadow={true}>
          <boxGeometry args={[1, 0.76, 0.15]}/>
          <meshStandardMaterial map={colorTexture} color={isHovered ? 'blue' : colours[type]}/>
        </mesh>
      ) : type === CellType.START ? (
        // <SimVehicle />
        <></>
      ) : null}
    </group>
  )
};

export default SimTile;