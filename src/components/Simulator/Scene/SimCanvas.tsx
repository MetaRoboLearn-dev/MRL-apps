import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import SimVehicle from "../Tile/SimVehicle.tsx";
import {DoubleSide} from "three";
import {useGrid} from "../../../hooks/useGrid.ts";
import SimCamera from "./SimCamera.tsx";
import {useEffect, useRef} from "react";
import {useSettings} from "../../../hooks/useSettings.ts";
import SimTiles from "../Tile/SimTiles.tsx";
import SimLights from "./SimLights.tsx";

const SimCanvas = () => {
  const { loadTextures } = useSettings();
  const { sizeX, sizeZ } = useGrid();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    loadTextures();
  }, []);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    controls.object.position.set(9, 10, 10);
    controls.target.set(0, 0, 0);
    controls.object.zoom = 1;
    controls.object.updateProjectionMatrix();
    controls.update();
  }, [sizeX, sizeZ]);

  return (
    <div className={'h-full w-full'}>
      <Canvas shadows className={'h-full w-full block'} resize={{ scroll: false, debounce: 0 }}>
        <color attach={"background"} args={['#00beee']} />

        <SimCamera />

        <SimLights />

        <mesh position={[-10, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[50, 50, 1]}>
          <planeGeometry/>
          <meshBasicMaterial color="#00beee" side={DoubleSide}/>
        </mesh>

        <SimVehicle />

        <SimTiles />

        <OrbitControls ref={controlsRef}
                       enableRotate={false}
                       enablePan={true}
                       enableZoom={true}
                       minZoom={0.5}
                       maxZoom={1}/>
      </Canvas>
    </div>
  );
};

export default SimCanvas;