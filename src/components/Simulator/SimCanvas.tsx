import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import SimTile from "./SimTile.tsx";
import {useEffect, useState} from "react";
import {GridInfo} from "../../types.ts";
import SimVehicle from "./SimVehicle.tsx";
import {DoubleSide} from "three";

const SimCanvas = () => {
  const x_size = 5;
  const z_size = 6;
  const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);

  const [gridInfo, setGridInfo] = useState<GridInfo>({
    size: x_size * z_size,
    start: z_size * (Math.trunc(x_size / 2) + x_size % 2 - 1),
    finish: z_size * (Math.trunc(x_size / 2) + 1) - 1,
    barriers: [0, 1, 2, 6, 7, 8, 10, 13, 14, 16, 19, 20, 22, 23],
  });

  useEffect(() => {
    const handleResize = () => {
      setAspect(window.innerWidth / window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={'h-full w-full'}>
      <Canvas orthographic camera={{
        position: [9, 10, 10],
        left: -3 * aspect / 2,
        right: 3 * aspect / 2,
        top: 3,
        bottom: -3,
        zoom: 0.8
      }}>
        {/*<gridHelper />*/}
        <ambientLight intensity={0.1}/>
        <directionalLight color="white" intensity={4} position={[2, 10, 7]} castShadow={true}/>

        <mesh position={[-10, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[50, 50, 1]}>
          <planeGeometry/>
          <meshBasicMaterial color="#00beee" side={DoubleSide}/>
        </mesh>

        <SimVehicle />

        <group position={[0, 0, 0]}>
          {Array.from({length: x_size}).map((_, x) =>
            Array.from({length: z_size}).map((_, z) => (
              <SimTile key={z_size * x + z}
                       index={z_size * x + z}
                       position={[-x + (Math.floor(x_size / 2)), 0, -z + 2]}
                       gridInfo={gridInfo}
                       setGridInfo={setGridInfo}/>
            ))
          )}
        </group>

        <OrbitControls enableRotate={false}
                       enablePan={true}
                       enableZoom={true}
                       minZoom={0.5}
                       maxZoom={1}/>
      </Canvas>
    </div>
  );
};

export default SimCanvas;