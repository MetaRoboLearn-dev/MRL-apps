import MainPage from "./pages/MainPage.tsx";
import {VehicleProvider} from "./providers/VehicleProvider.tsx";
import {SettingsProvider} from "./providers/SettingsProvider.tsx";
import {CodeProvider} from "./providers/CodeProvider.tsx";
import GridProvider from "./providers/GridProvider.tsx";
import UIProvider from "./providers/UIProvider.tsx";
import {useGLTF} from "@react-three/drei";
import {TextureLoader} from "three";

function App() {
  const loader = new TextureLoader();
  loader.load('textures/fountain.png');
  loader.load('textures/lake.png');
  useGLTF('models/Tree_big.glb');
  useGLTF('models/Tree_medium.glb');
  useGLTF('models/Tree_small.glb');

  return (
    <UIProvider>
      <SettingsProvider>
        <CodeProvider>
          <GridProvider>
            <VehicleProvider>
              <MainPage />
            </VehicleProvider>
          </GridProvider>
        </CodeProvider>
      </SettingsProvider>
    </UIProvider>
  );
}

export default App
