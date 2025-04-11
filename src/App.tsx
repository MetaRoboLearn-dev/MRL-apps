import MainPage from "./pages/MainPage.tsx";
import {useState} from "react";
import {
  GridSizeContext,
  SimSettingsContext,
  SimFocusedContext,
  HolderIndexContext,
  ActiveCodeContext
} from "./Context.tsx";
import {CellType} from "./enums/CellTypes.tsx";

function App() {
  const [gridSize, setGridSize] = useState(5);
  const [simFocused, setSimFocused] = useState(false);
  const [holderIndex, setHolderIndex] = useState(-1);
  const [editSettings, setEditSettings] = useState({cellType: CellType.START});
  const primjer = `# Primjer kretanja robota
broj_koraka = 1 + 2  # 3 koraka naprijed
for korak in range(broj_koraka):
  print('naprijed')

print('rotiraj desno') # Robot se okreće desno

broj_koraka = 5 - 3  # 2 koraka naprijed
for korak in range(broj_koraka):
  print('naprijed')

print('rotiraj lijevo')  # Robot se okreće lijevo

koraci_nazad = 2 * 2  # 4 koraka nazad
while koraci_nazad > 0:
  print('nazad')
  koraci_nazad -= 1 
`
  const [activeCode, setActiveCode] = useState(primjer);

  return (
    <GridSizeContext.Provider value={[gridSize, setGridSize]}>
      <SimFocusedContext.Provider value={[simFocused, setSimFocused]}>
        <HolderIndexContext.Provider value={[holderIndex, setHolderIndex]}>
          <SimSettingsContext.Provider value={[editSettings, setEditSettings]}>
            <ActiveCodeContext.Provider value={[activeCode, setActiveCode]}>
              <MainPage />
            </ActiveCodeContext.Provider>
          </SimSettingsContext.Provider>
        </HolderIndexContext.Provider>
      </SimFocusedContext.Provider>
    </GridSizeContext.Provider>
  );
}

export default App
