import {useEffect} from "react";
import {useSettings} from "../../../hooks/useSettings.ts";
import {Canvas} from "@react-three/fiber";
import SimVehicle from "../Tile/SimVehicle.tsx";
import SimCamera from "./SimCamera.tsx";
import SimTiles from "./SimTiles.tsx";
import SimLights from "./SimLights.tsx";
import SimControls from "./SimControls.tsx";

const SimCanvas = () => {
  const { loadTextures } = useSettings();

  useEffect(() => {
    loadTextures();
  }, []);

  return (
    <div className={'h-full w-full'}>
      <Canvas shadows className={'h-full w-full block'} resize={{ scroll: false, debounce: 0 }}>
        <color attach={"background"} args={['#00beee']} />
        <SimCamera />
        <SimLights />
        <SimVehicle />
        <SimTiles />
        <SimControls />
      </Canvas>
    </div>
  );
};

export default SimCanvas;