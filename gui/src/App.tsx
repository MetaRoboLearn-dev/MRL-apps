import MainPage from "./pages/MainPage.tsx";
import {VehicleProvider} from "./providers/VehicleProvider.tsx";
import {SettingsProvider} from "./providers/SettingsProvider.tsx";
import {CodeProvider} from "./providers/CodeProvider.tsx";
import GridProvider from "./providers/GridProvider.tsx";
import UIProvider from "./providers/UIProvider.tsx";
import {useGLTF} from "@react-three/drei";
import {TextureLoader} from "three";
import ToastProvider from "./providers/ToastProvider.tsx";

function App() {
  // TODO - check if this really is needed after changing to /src/img
  const loader = new TextureLoader();
  loader.load('textures/fountain.png');
  loader.load('textures/lake.png');
  useGLTF('models/Tree_big.glb');
  useGLTF('models/Tree_medium.glb');
  useGLTF('models/Tree_small.glb');

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default App
