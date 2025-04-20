import MainPage from "./pages/MainPage.tsx";
import {VehicleProvider} from "./providers/VehicleProvider.tsx";
import {SettingsProvider} from "./providers/SettingsProvider.tsx";
import {CodeProvider} from "./providers/CodeProvider.tsx";
import GridProvider from "./providers/GridProvider.tsx";

function App() {
  return (
    <SettingsProvider>
      <CodeProvider>
        <GridProvider>
          <VehicleProvider>
            <MainPage />
          </VehicleProvider>
        </GridProvider>
      </CodeProvider>
    </SettingsProvider>
  );
}

export default App
