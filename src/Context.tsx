// u kontekst
// gridSize, simFocused, tank holder index, grid edit postavke

import {createContext, Dispatch, SetStateAction} from "react";
import {CellType} from "./enums/CellTypes.tsx";

// upitno (jer je ovisno o posebnom simu)
export const GridSizeContext
  = createContext<[number, Dispatch<SetStateAction<number>>]> ([10, () => {}]);

export const HolderIndexContext
  = createContext<[number, Dispatch<SetStateAction<number>>]> ([-1, () => {}]);

// sigurno ok
export const SimFocusedContext
  = createContext<[boolean, Dispatch<SetStateAction<boolean>>]> ([false, () => {}]);

export const SimSettingsContext
  = createContext<[SimSettings, Dispatch<SetStateAction<SimSettings>>]> ([{
    cellType: CellType.GROUND,
  }, () => {}]);

interface SimSettings {
  cellType: CellType
}

export const ActiveCodeContext
  = createContext<[string, Dispatch<SetStateAction<string>>]>(['', () => {}]);