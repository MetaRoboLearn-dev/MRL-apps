import MainPage from "./pages/MainPage.tsx";
import {useState} from "react";
import {GridSizeContext, SimSettingsContext, SimFocusedContext, HolderIndexContext} from "./Context.tsx";
import {CellType} from "./enums/CellTypes.tsx";

function App() {
  const [gridSize, setGridSize] = useState(5);
  const [simFocused, setSimFocused] = useState(false);
  const [holderIndex, setHolderIndex] = useState(-1);
  const [editSettings, setEditSettings] = useState({cellType: CellType.START});

  return (
    <GridSizeContext.Provider value={[gridSize, setGridSize]}>
      <SimFocusedContext.Provider value={[simFocused, setSimFocused]}>
        <HolderIndexContext.Provider value={[holderIndex, setHolderIndex]}>
          <SimSettingsContext.Provider value={[editSettings, setEditSettings]}>
            <MainPage />
          </SimSettingsContext.Provider>
        </HolderIndexContext.Provider>
      </SimFocusedContext.Provider>
    </GridSizeContext.Provider>
  );
}

export default App
