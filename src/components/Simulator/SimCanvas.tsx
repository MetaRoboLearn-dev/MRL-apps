import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import SimTile from "./SimTile.tsx";
import {useState} from "react";
import {GridInfo} from "../../interfaces.tsx";
import SimVehicle from "./SimVehicle.tsx";

const SimCanvas = () => {
  const x_size = 5;
  const z_size = 6;

  const [gridInfo, setGridInfo] = useState<GridInfo>({
    size: x_size * z_size,
    start: z_size * (Math.trunc(x_size / 2) + x_size % 2 - 1),
    finish: z_size * (Math.trunc(x_size / 2) + 1) - 1,
    barriers: [2, 8, 27, 21]
  });

  return (
    <div className={'h-full w-full'}>
      <Canvas orthographic camera={{position: [5, 5, 5], left: -3, right: 3, top: 3, bottom: -3, zoom: 0.8}} shadows>
        <gridHelper />
        <ambientLight intensity={0.1}/>
        <directionalLight color="white" intensity={4} position={[2, 10, 7]} castShadow={true}/>

        <SimVehicle />

        <group position={[0, 0, 0]}>
          {Array.from({length: x_size}).map((_, x) =>
            Array.from({length: z_size}).map((_, z) => (
              <SimTile key={z_size * x + z} index={z_size * x + z} position={[-x + (x_size / 2), 0, - z + 2]} gridInfo={gridInfo} setGridInfo={setGridInfo}/>
            ))
          )}
        </group>

      <OrbitControls enableRotate={true}
                     enablePan={true}
                     enableZoom={true}
                     minZoom={0.5}
                     maxZoom={1} />
      </Canvas>
    </div>
  );
};

export default SimCanvas;