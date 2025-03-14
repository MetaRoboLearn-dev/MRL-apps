import MainPage from "./pages/MainPage.tsx";
import {useState} from "react";
import {GridSizeContext, EditSettingsContext, SimFocusedContext, HolderIndexContext} from "./Context.tsx";

function App() {
  const [gridSize, setGridSize] = useState(5); // Pretpostavljena veličina grida
  const [simFocused, setSimFocused] = useState(false);
  const [holderIndex, setHolderIndex] = useState(-1);
  const [editSettings, setEditSettings] = useState(true);

  return (
    // 3️⃣ Omotavanje MainPage unutar svih Provider-a
    <GridSizeContext.Provider value={[gridSize, setGridSize]}>
      <SimFocusedContext.Provider value={[simFocused, setSimFocused]}>
        <HolderIndexContext.Provider value={[holderIndex, setHolderIndex]}>
          <EditSettingsContext.Provider value={[editSettings, setEditSettings]}>
            <MainPage />
          </EditSettingsContext.Provider>
        </HolderIndexContext.Provider>
      </SimFocusedContext.Provider>
    </GridSizeContext.Provider>
  );
}

export default App
