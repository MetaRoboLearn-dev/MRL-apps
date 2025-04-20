import {Canvas} from "@react-three/fiber";
import {OrbitControls, OrthographicCamera} from "@react-three/drei";
import SimTile from "./SimTile.tsx";
import {useEffect, useRef} from "react";
import SimVehicle from "./SimVehicle.tsx";
import {DoubleSide} from "three";
import * as THREE from 'three';
import {useGrid} from "../../hooks/useGrid.ts";

const SimCanvas = () => {
  const { sizeX, sizeZ } = useGrid();
  const cameraRef = useRef<THREE.OrthographicCamera>(null);

  useEffect(() => {
    const handleResize = () => {
      const newAspect = window.innerWidth / window.innerHeight
      if (cameraRef.current) {
        cameraRef.current.left = -3 * newAspect / 2;
        cameraRef.current.right = 3 * newAspect / 2;
        // cameraRef.current.bottom = -3 * newAspect / 2;
        // cameraRef.current.top = 3 * newAspect / 2;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('fullscreenchange', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('fullscreenchange', handleResize);
    }
  }, []);

  return (
    <div className={'h-full w-full'}>
      <Canvas shadows>
        <OrthographicCamera args={[]}
          ref={cameraRef}
          makeDefault={true}
          position={[9, 10, 10]}
          left={-3} right={3} bottom={-3} top={3} zoom={0.8} />
        {/*<gridHelper />*/}

        <ambientLight intensity={0.8}/>
        <directionalLight color="white"
                          castShadow={true}
                          position={[2, 10, 7]}
                          intensity={2.8}
                          shadow-mapSize-width={1024}
                          shadow-mapSize-height={1024}
                          shadow-camera-left={-10}
                          shadow-camera-right={10}
                          shadow-camera-top={10}
                          shadow-camera-bottom={-10}/>

        <mesh position={[-10, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[50, 50, 1]}>
          <planeGeometry/>
          <meshBasicMaterial color="#00beee" side={DoubleSide}/>
        </mesh>

        <SimVehicle />

        <group position={[0, 0, 0]}>
          {Array.from({length: sizeX}).map((_, x) =>
            Array.from({length: sizeZ}).map((_, z) => (
              <SimTile key={sizeZ * x + z}
                       index={sizeZ * x + z}
                       position={[-x + (Math.floor(sizeX / 2)), 0, -z + 2]}/>
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