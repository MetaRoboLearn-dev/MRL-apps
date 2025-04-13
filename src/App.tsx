import MainPage from "./pages/MainPage.tsx";
import {useState} from "react";
import {HolderIndexContext, ActiveCodeContext} from "./providers/Context.tsx";
import {VehicleProvider} from "./providers/VehicleProvider.tsx";
import {SettingsProvider} from "./providers/SettingsProvider.tsx";

function App() {
  const [holderIndex, setHolderIndex] = useState(-1);
  const primjer = `print("lijevo") # rotiraj_lijevo()

broj_koraka = 1 + 1  # 2x naprijed
for korak in range(broj_koraka):
    print("naprijed") # naprijed()

print("desno") # rotiraj_desno()

broj_koraka = 1 + 2  # 3x naprijed
for korak in range(broj_koraka):
    print("naprijed")

print("desno")

broj_koraka = 2 * 2  # 4x naprijed
for korak in range(broj_koraka):
    print("naprijed")

print("lijevo")

broj_koraka = 2  # 2x naprijed
for korak in range(broj_koraka):
    print("naprijed")

print("lijevo")

broj_koraka = 2  # 2x naprijed
for korak in range(broj_koraka):
    print("naprijed")`;
  const [activeCode, setActiveCode] = useState(primjer);

  return (
    <HolderIndexContext.Provider value={[holderIndex, setHolderIndex]}>
      <ActiveCodeContext.Provider value={[activeCode, setActiveCode]}>
        <SettingsProvider>
          <VehicleProvider>
            <MainPage />
          </VehicleProvider>
        </SettingsProvider>
      </ActiveCodeContext.Provider>
    </HolderIndexContext.Provider>
  );
}

export default App
