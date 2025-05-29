import MainPage from "./pages/MainPage.tsx";
import {VehicleProvider} from "./providers/VehicleProvider.tsx";
import {SettingsProvider} from "./providers/SettingsProvider.tsx";
import {CodeProvider} from "./providers/CodeProvider.tsx";
import GridProvider from "./providers/GridProvider.tsx";
import UIProvider from "./providers/UIProvider.tsx";
import { TextureLoader } from 'three';
import { Stickers } from './types';

const loader = new TextureLoader();
Object.values(Stickers).forEach((sticker) => {
  if (sticker?.image) {
    loader.load(sticker.image, () => {
      console.log(`Preloaded: ${sticker.image}`);
    });
  }
});

function App() {
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
